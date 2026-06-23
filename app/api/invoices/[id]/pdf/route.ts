import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createElement, type ReactElement } from "react";
import requireAdmin from "@/lib/auth/require-admin";
import {
  InvoicePdfDocument,
  type InvoicePdfData,
} from "@/lib/invoices/InvoicePdfDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BusinessRecord = {
  name: string | null;
  city: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  type: string | null;
};

type RawInvoiceRecord = {
  id: number;
  invoice_number: string | null;
  period_month: string | null;
  booking_count: number | string;
  commission_value: number | string;
  total_amount: number | string;
  notes: string | null;
  status: string;
  created_at: string;
  business: BusinessRecord | BusinessRecord[] | null;
};

function toNumber(value: number | string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const invoiceId = Number(id);

  if (!Number.isSafeInteger(invoiceId) || invoiceId <= 0) {
    return NextResponse.json({ error: "Invalid invoice id" }, { status: 400 });
  }

  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("monthly_invoice")
    .select(`
      id,
      invoice_number,
      period_month,
      booking_count,
      commission_value,
      total_amount,
      notes,
      status,
      created_at,
      business:bussiness_id(name, city, address, email, phone, type)
    `)
    .eq("id", invoiceId)
    .maybeSingle();

  if (error) {
    console.error("invoice PDF lookup failed", error);
    return NextResponse.json(
      { error: "Could not load the invoice" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const rawInvoice = data as unknown as RawInvoiceRecord;
  const business = Array.isArray(rawInvoice.business)
    ? rawInvoice.business[0] ?? null
    : rawInvoice.business;
  const businessType = business?.type?.toLowerCase() ?? "";

  const invoice: InvoicePdfData = {
    invoiceNumber: rawInvoice.invoice_number ?? `MC-${rawInvoice.id}`,
    periodMonth: rawInvoice.period_month,
    createdAt: rawInvoice.created_at,
    status: rawInvoice.status,
    bookingCount: toNumber(rawInvoice.booking_count),
    commissionValue: toNumber(rawInvoice.commission_value),
    totalAmount: toNumber(rawInvoice.total_amount),
    notes: rawInvoice.notes,
    billingModel: ["hotel", "riad"].includes(businessType)
      ? "percentage"
      : "per_booking",
    business,
  };

  const document = createElement(InvoicePdfDocument, { invoice }) as unknown as ReactElement<DocumentProps>;
  const pdf = await renderToBuffer(document);
  const filename = invoice.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-");

  return new Response(Uint8Array.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}

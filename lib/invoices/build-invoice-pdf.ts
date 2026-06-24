import "server-only";

import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createElement, type ReactElement } from "react";
import {
  InvoicePdfDocument,
  type InvoicePdfData,
} from "@/lib/invoices/InvoicePdfDocument";

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

export class InvoicePdfError extends Error {
  constructor(
    message: string,
    public readonly status: 404 | 500,
  ) {
    super(message);
    this.name = "InvoicePdfError";
  }
}

function toNumber(value: number | string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export async function buildInvoicePdf(
  supabase: SupabaseClient,
  invoiceId: number,
) {
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
    throw new InvoicePdfError("Could not load the invoice", 500);
  }

  if (!data) {
    throw new InvoicePdfError("Invoice not found", 404);
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
  const safeInvoiceNumber = invoice.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-");

  return {
    business,
    filename: `${safeInvoiceNumber}.pdf`,
    invoiceNumber: invoice.invoiceNumber,
    pdf: Buffer.from(pdf),
    status: rawInvoice.status,
  };
}

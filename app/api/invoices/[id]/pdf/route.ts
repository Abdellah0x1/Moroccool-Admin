import { NextResponse } from "next/server";
import requireAdmin from "@/lib/auth/require-admin";
import {
  buildInvoicePdf,
  InvoicePdfError,
} from "@/lib/invoices/build-invoice-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  try {
    const { filename, pdf } = await buildInvoicePdf(supabase, invoiceId);

    return new Response(Uint8Array.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    if (error instanceof InvoicePdfError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("invoice PDF generation failed", error);
    return NextResponse.json(
      { error: "Could not generate the invoice PDF" },
      { status: 500 },
    );
  }
}

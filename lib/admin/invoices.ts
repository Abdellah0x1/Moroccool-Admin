import { createClient } from "../supabase/server";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "disputed"
  | "void";

export type InvoiceRow = {
  id: number;
  invoice_number: string | null;
  bussiness_id: number;
  period_month: string | null;
  booking_count: number;
  commission_value: number;
  total_amount: number;
  status: InvoiceStatus;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  business: {
    name: string | null;
    city: string | null;
    type: string | null;
  } | null;
};

export type InvoiceFilters = {
  month?: string;
  status?: string;
  q?: string;
};

type RawInvoiceRow = Omit<InvoiceRow, "business"> & {
  business: InvoiceRow["business"] | InvoiceRow["business"][];
};

function getMonthRange(month: string) {
  if (!/^\d{4}-\d{2}$/.test(month)) return null;

  const [year, monthIndex] = month.split("-").map(Number);
  const nextMonth = monthIndex === 12 ? 1 : monthIndex + 1;
  const nextYear = monthIndex === 12 ? year + 1 : year;

  return {
    start: `${month}-01`,
    end: `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`,
  };
}

export async function getInvoices({ month, status, q }: InvoiceFilters) {
  const supabase = await createClient();
  let query = supabase
    .from("monthly_invoice")
    .select(`
      id,
      invoice_number,
      bussiness_id,
      period_month,
      booking_count,
      commission_value,
      total_amount,
      status,
      sent_at,
      paid_at,
      created_at,
      updated_at,
      business:bussiness_id(name, city, type)
    `)
    .order("period_month", { ascending: false })
    .order("created_at", { ascending: false });

  const range = month ? getMonthRange(month) : null;

  if (range) {
    query = query.gte("period_month", range.start).lt("period_month", range.end);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.log("invoice lookup error", error);
    return [] as InvoiceRow[];
  }

  const invoices = ((data ?? []) as unknown as RawInvoiceRow[]).map((invoice) => ({
    ...invoice,
    business: Array.isArray(invoice.business)
      ? invoice.business[0] ?? null
      : invoice.business ?? null,
  }));
  const search = q?.trim().toLowerCase();

  if (!search) return invoices;

  return invoices.filter((invoice) => {
    const values = [
      invoice.invoice_number,
      invoice.business?.name,
      invoice.business?.city,
    ];

    return values.some((value) => value?.toLowerCase().includes(search));
  });

}



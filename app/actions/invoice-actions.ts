"use server";

import { revalidatePath } from "next/cache";
import requireAdmin from "@/lib/auth/require-admin";
import { BrevoClient, BrevoError } from "@getbrevo/brevo";
import {
    buildInvoicePdf,
    InvoicePdfError,
} from "@/lib/invoices/build-invoice-pdf";

type InvoiceActionState = {
    error?: string;
    success?: string;
    generated?: boolean;
};

type BillingModel = "percentage" | "per_booking";

type AccommodationBookingRow = {
    booking_id: number;
    quoted_price: number | string | null;
};

const ACCOMMODATION_TYPES = new Set(["hotel", "riad"]);
const DINING_TYPES = new Set(["restaurant", "cafe"]);

function valueOf(formData: FormData, name: string) {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
}

function monthRange(periodMonth: string) {
    const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(periodMonth);

    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const nextMonth = new Date(Date.UTC(year, month, 1));

    return {
        start: `${periodMonth}-01`,
        end: `${nextMonth.getUTCFullYear()}-${String(
            nextMonth.getUTCMonth() + 1,
        ).padStart(2, "0")}-01`,
    };
}

function roundMoney(value: number) {
    return Math.round(value * 100) / 100;
}

export async function generateMonthlyInvoiceAction(
    _previousState: InvoiceActionState,
    formData: FormData,
): Promise<InvoiceActionState> {
    const businessId = Number(valueOf(formData, "business-id"));
    const periodMonth = valueOf(formData, "period-month");
    const commissionValue = Number(valueOf(formData, "commission-value"));
    const note = valueOf(formData, "note") || null;

    if (!Number.isSafeInteger(businessId) || businessId <= 0) {
        return { error: "Please select a business." };
    }

    const range = monthRange(periodMonth);

    if (!range) {
        return { error: "Please choose a valid billing month." };
    }

    if (!Number.isFinite(commissionValue) || commissionValue <= 0) {
        return { error: "Commission must be greater than zero." };
    }

    const { supabase } = await requireAdmin();

    // The server—not the modal—decides which calculation applies.
    const { data: business, error: businessError } = await supabase
        .from("businesses")
        .select("id, name, type")
        .eq("id", businessId)
        .maybeSingle();

    if (businessError || !business) {
        return { error: "The selected business could not be found." };
    }

    const businessType = business.type?.toLowerCase() ?? "";

    let billingModel: BillingModel;

    if (ACCOMMODATION_TYPES.has(businessType)) {
        billingModel = "percentage";
    } else if (DINING_TYPES.has(businessType)) {
        billingModel = "per_booking";
    } else {
        return { error: "This business type cannot be invoiced yet." };
    }

    if (billingModel === "percentage" && commissionValue > 100) {
        return { error: "A percentage commission cannot be greater than 100%." };
    }

    let bookingCount = 0;
    let totalAmount = 0;

    if (billingModel === "percentage") {
        const { data, error } = await supabase
            .from("accommodation_booking_details")
            .select(
                "booking_id, quoted_price, booking:bookings!inner(id, business_id, status)",
            )
            .eq("booking.business_id", businessId)
            .eq("booking.status", "confirmed")
            .gte("check_out", range.start)
            .lt("check_out", range.end);

        if (error) {
            return { error: "Could not load confirmed accommodation bookings." };
        }

        const bookings = (data ?? []) as unknown as AccommodationBookingRow[];

        if (bookings.length === 0) {
            return {
                error: "No confirmed accommodation bookings were found for this month.",
            };
        }

        const missingPrices = bookings.some((booking) => {
            const price = Number(booking.quoted_price);
            return !Number.isFinite(price) || price <= 0;
        });

        if (missingPrices) {
            return {
                error: "One or more confirmed bookings have no valid quoted price.",
            };
        }

        bookingCount = bookings.length;

        const grossBookingValue = bookings.reduce(
            (sum, booking) => sum + Number(booking.quoted_price),
            0,
        );

        totalAmount = roundMoney(
            grossBookingValue * (commissionValue / 100),
        );
    } else {
        const { count, error } = await supabase
            .from("restaurant_booking_details")
            .select("booking_id, booking:bookings!inner(id, business_id, status)", {
                count: "exact",
                head: true,
            })
            .eq("booking.business_id", businessId)
            .eq("booking.status", "confirmed")
            .gte("requested_date", range.start)
            .lt("requested_date", range.end);

        if (error) {
            return { error: "Could not load confirmed restaurant bookings." };
        }

        bookingCount = count ?? 0;

        if (bookingCount === 0) {
            return {
                error: "No confirmed restaurant bookings were found for this month.",
            };
        }

        totalAmount = roundMoney(bookingCount * commissionValue);
    }

    if (totalAmount <= 0) {
        return { error: "The generated invoice total must be greater than zero." };
    }

    const { data: existingInvoice, error: existingInvoiceError } = await supabase
        .from("monthly_invoice")
        .select("id, status")
        .eq("bussiness_id", businessId)
        .eq("period_month", range.start)
        .maybeSingle();

    if (existingInvoiceError) {
        return { error: "Could not check for an existing invoice." };
    }

    if (existingInvoice && existingInvoice.status !== "draft") {
        return {
            error: "This invoice has already been sent, paid, or otherwise finalized.",
        };
    }

    const invoiceNumber = `MC-${businessId}-${periodMonth.replace("-", "")}`;

    const invoiceValues = {
        invoice_number: invoiceNumber,
        bussiness_id: businessId,
        period_month: range.start,
        notes: note,
        booking_count: bookingCount,
        commission_value: commissionValue,
        total_amount: totalAmount,
    };

    const { error: saveError } = existingInvoice
        ? await supabase
            .from("monthly_invoice")
            .update(invoiceValues)
            .eq("id", existingInvoice.id)
        : await supabase
            .from("monthly_invoice")
            .insert({ ...invoiceValues, status: "draft" });

    if (saveError) {
        return { error: `Could not save the invoice: ${saveError.message}` };
    }

    revalidatePath("/invoices");
    revalidatePath(`/businesses/${businessId}`);

    return {
        generated: true,
        success: `Draft invoice generated for ${bookingCount} confirmed booking${bookingCount === 1 ? "" : "s"}: ${totalAmount.toFixed(2)} MAD.`,
    };
}

export async function markAsPaid(invoiceId: number) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("monthly_invoice").update({
        status: "paid",
        paid_at: new Date().toISOString(),
    }).eq("id", invoiceId);

    if (error) {
        return { error: "Could not mark as paid" };
    }

    revalidatePath("/invoices");
    return { success: "Invoice marked as paid" };

}



export async function sendInvoiceByMail(invoiceId: number) {
    if (!Number.isSafeInteger(invoiceId) || invoiceId <= 0) {
        return { error: "Invalid invoice id." };
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME;

    if (!apiKey || !senderEmail || !senderName) {
        return { error: "Brevo email is not configured." };
    }

    const { supabase } = await requireAdmin();
    let invoice: Awaited<ReturnType<typeof buildInvoicePdf>>;

    try {
        invoice = await buildInvoicePdf(supabase, invoiceId);
    } catch (error) {
        if (error instanceof InvoicePdfError) {
            return { error: error.message };
        }

        console.error("invoice PDF generation failed", error);
        return { error: "Could not generate the invoice PDF." };
    }

    const recipientEmail = invoice.business?.email;

    if (!recipientEmail) {
        return { error: "This business has no billing email address." };
    }

    if (invoice.status === "void") {
        return { error: "Void invoices cannot be sent." };
    }

    try {
        const brevo = new BrevoClient({
            apiKey,
            timeoutInSeconds: 30,
            maxRetries: 0,
        });

        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                email: senderEmail,
                name: senderName,
            },
            to: [
                {
                    email: recipientEmail,
                    name: invoice.business?.name ?? "Moroccool partner",
                },
            ],
            subject: `Invoice ${invoice.invoiceNumber} from Moroccool`,
            textContent: `Hello ${invoice.business?.name ?? "there"},

Your Moroccool invoice ${invoice.invoiceNumber} is attached as a PDF.

Thank you,
Moroccool Billing`,
            attachment: [
                {
                    name: invoice.filename,
                    content: invoice.pdf.toString("base64"),
                },
            ],
            tags: ["invoice"],
        });
    } catch (error) {
        if (error instanceof BrevoError) {
            console.error("Brevo failed", {
                status: error.statusCode,
                message: error.message,
                body: error.body,
            });

            return {
                error: `Brevo ${error.statusCode}: ${error.message}`,
            };
        }

        console.error("Brevo invoice send failed", error);
        return { error: "Brevo could not send this invoice." };
    }

    const { error: updateError } = await supabase
        .from("monthly_invoice")
        .update({
            status: "sent",
            sent_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);

    if (updateError) {
        // Email may already have been accepted by Brevo—do not automatically resend it.
        return { error: "Invoice was sent, but its status could not be updated." };
    }

    revalidatePath("/invoices");

    return { success: `Invoice sent to ${recipientEmail}.` };
}

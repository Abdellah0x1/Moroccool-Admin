"use server";

import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendBookingStatusEmail } from "@/lib/brevo/email";

/**
 * Shared helper: updates booking status, fetches related data,
 * sends a Brevo notification email, then redirects.
 */
async function updateBookingStatus(id: number, status: "confirmed" | "rejected") {
    const supabase = await createClient();

    // 1. Update the booking status
    const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(`
            id,
            type,
            customer_email,
            customer_name,
            status,
            owner_note,
            etablissement_id
        `)
        .single();

    if (bookingError) {
        console.error("Booking update error", bookingError);
    }

    if (!booking) {
        return { error: "Couldn't find booking" };
    }

    // 2. Fetch the listing name
    const { data: listing, error: listingError } = await supabase
        .from("etablissement")
        .select("name")
        .eq("id", booking.etablissement_id)
        .single();

    if (listingError) {
        console.error("Listing error", listingError);
    }

    // 3. Fetch details & send email based on booking type
    if (booking.type === "restaurant") {
        const { data: bookingDetails } = await supabase
            .from("restaurant_booking_details")
            .select("requested_date, requested_time, guests")
            .eq("booking_id", id)
            .maybeSingle();

        if (bookingDetails) {
            await sendBookingStatusEmail({
                customerEmail: booking.customer_email,
                customerName: booking.customer_name,
                listingName: listing?.name ?? "the restaurant",
                bookingType: "restaurant",
                status,
                details: [
                    { label: "Date", value: bookingDetails.requested_date },
                    { label: "Time", value: bookingDetails.requested_time },
                    { label: "Guests", value: `${bookingDetails.guests} people` },
                ],
                ownerNote: booking.owner_note,
            });
        }
    }

    if (booking.type === "hotel") {
        const { data: bookingDetails } = await supabase
            .from("accommodation_booking_details")
            .select(`
                check_in,
                check_out,
                guests,
                rooms,
                arrival_time,
                quoted_price,
                room_type:accommodation_room_types(name)
            `)
            .eq("booking_id", id)
            .maybeSingle();

        if (bookingDetails) {
            const roomType = Array.isArray(bookingDetails.room_type)
                ? bookingDetails.room_type[0]
                : bookingDetails.room_type;

            const details = [
                { label: "Check-in", value: bookingDetails.check_in },
                { label: "Check-out", value: bookingDetails.check_out },
                { label: "Guests", value: `${bookingDetails.guests} people` },
                { label: "Rooms", value: String(bookingDetails.rooms) },
                bookingDetails.arrival_time
                    ? { label: "Arrival", value: String(bookingDetails.arrival_time).slice(0, 5) }
                    : null,
                roomType?.name ? { label: "Room type", value: roomType.name } : null,
            ].filter((detail): detail is { label: string; value: string } => detail !== null);

            await sendBookingStatusEmail({
                customerEmail: booking.customer_email,
                customerName: booking.customer_name,
                listingName: listing?.name ?? "the hotel",
                bookingType: "hotel",
                status,
                details,
                ownerNote: booking.owner_note,
            });
        }
    }

    revalidatePath("/bookings");
    redirect("/bookings");
}

export async function approveBooking(id: number) {
    return updateBookingStatus(id, "confirmed");
}

export async function declineBooking(id: number) {
    return updateBookingStatus(id, "rejected");
}
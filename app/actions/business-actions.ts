"use server"

import requireAdmin from "@/lib/auth/require-admin";
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


function redirectAfterBusinessAction(businessId: number, redirectTarget: "list" | "detail" = "list") {
    redirect(redirectTarget === "detail" ? `/businesses/${businessId}` : '/businesses')
}

export async function approveBusiness(businessId: number, redirectTarget: "list" | "detail" = "list") {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
        .from("businesses")
        .update({ status: "approved" })
        .eq("id", businessId)
        .select("id")
        .single()

    if (error) {
        console.log('error approving businesses', error)
        return {
            error: error.message
        }
    }
    revalidatePath('/businesses');
    revalidatePath(`/businesses/${businessId}`)
    redirectAfterBusinessAction(businessId, redirectTarget)
}

export async function requestBusinessChanges(businessId: number, redirectTarget: "list" | "detail" = "list") {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
        .from("businesses")
        .update({ status: "needs_changes" })
        .eq("id", businessId)
        .select("id")
        .single()

    if (error) {
        console.log('error requesting business changes', error)
        return {
            error: error.message
        }
    }

    revalidatePath('/businesses');
    revalidatePath(`/businesses/${businessId}`)
    redirectAfterBusinessAction(businessId, redirectTarget)
}


export async function rejectBusiness(businessId: number, redirectTarget: "list" | "detail" = "list") {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from('businesses').update({
        status: 'rejected'
    }).eq('id', businessId)
        .select('id')
        .single();

    if (error) {
        console.log('error rejecting businesses', error)
        return {
            error: error.message
        }
    }
    revalidatePath('/businesses');
    revalidatePath(`/businesses/${businessId}`)
    redirectAfterBusinessAction(businessId, redirectTarget)
}


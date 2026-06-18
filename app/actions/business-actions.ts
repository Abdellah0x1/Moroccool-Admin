"use server"

import requireAdmin from "@/lib/auth/require-admin";
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function approveBusiness(businessId: number) {
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
    return redirect('/businesses')
}



export async function rejectBusiness(businessId: number) {
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
    return redirect('/businesses')
}


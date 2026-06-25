"use server"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";



export type LoginState = {
    error?: string,
    success?: string
}
export async function loginAdmin(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const email = String(formData.get('email')).trim();
    const password = String(formData.get('password'));
    if (!email || !password) return {
        error: "All fields are required"
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    if (error) return {
        error: error.message
    }


    const { data: profile } = await supabase.from('profile').select('role').eq('id', data.user.id).single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        await supabase.auth.signOut();
        return {
            error: "you are not authorized to login as admin"
        }
    }

    return { success: "success" }
}


export async function logoutAdmin() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

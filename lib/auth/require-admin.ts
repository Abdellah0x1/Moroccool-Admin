import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export default async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profile').select("id, name,email,role").eq('id', user.id).single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        redirect('/login')
    }

    return {
        user,
        profile,
        supabase
    }
}

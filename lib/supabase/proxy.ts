import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";


export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request
    });

    const isLoginRoute = request.nextUrl.pathname.startsWith("/login");
    const hasSupabaseCookie = request.cookies
        .getAll()
        .some((cookie) => cookie.name.startsWith("sb-"));

    if (isLoginRoute || !hasSupabaseCookie) {
        return response;
    }

    const supabase = await createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => {
                    request.cookies.set(name, value);
                });
                response = NextResponse.next({ request })

                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options)
                })


            }
        }
    }
    )
    await supabase.auth.getClaims();

    return response;

}

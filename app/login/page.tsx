"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { loginAdmin } from "../actions/auth-actions"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
    const [state, loginAction, isPending] = useActionState(loginAdmin, { error: '', success: "" })
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push('/');
        }
    }, [state.success, router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-4">
            <Card className="mx-auto w-full max-w-md shadow-2xl border-none rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="space-y-3 pb-8 pt-10">
                    <CardTitle className="text-center font-extrabold text-3xl tracking-tight text-slate-900 dark:text-slate-100">
                        Welcome Back
                    </CardTitle>
                </CardHeader>
                <form action={loginAction}>
                    <CardContent className="space-y-6 pb-8 px-8">
                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                placeholder="Email address" 
                                required 
                                className="h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
                            <Input 
                                id="password" 
                                name="password" 
                                placeholder="••••••••" 
                                type="password" 
                                required 
                                className="h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        {state?.error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-sm text-center font-medium text-red-600 dark:text-red-400">{state.error}</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="px-8 pb-10">
                        <Button 
                            disabled={isPending} 
                            className="bg-primary-container w-full h-12 text-base font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-primary-container/90 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isPending ? "Logging in..." : "Login"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
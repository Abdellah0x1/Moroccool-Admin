import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";


const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: "Moroccool Admin",
    description: "Operational admin console for Moroccool.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
            <body className="min-h-full w-screen">
                {children}
            </body>
        </html>
    );
}
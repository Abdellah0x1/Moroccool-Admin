import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/AppSideBar";
import { TopBar } from "@/components/Top-bar";
import requireAdmin from "@/lib/auth/require-admin";


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { profile } = await requireAdmin();
  return (
    <SidebarProvider>
      <main className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen w-full">
        <AppSideBar className="h-full row-span-2 col-1" />
        <TopBar className="w-full col-[2/-1] row-span-1" profile={profile} />
        <div className="bg-gray-50 col-[2/-1] row-span-1 admin-page">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

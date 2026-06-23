"use client";

import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { LayoutDashboard, MapPin, UtensilsCrossed, Settings, LogOut, Calendar, Hotel, Briefcase, FileText } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AppSideBar({ className }: { className: string }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/destinations", label: "Destinations", icon: MapPin },
        { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
        { href: "/accomodations", label: "Accomodations", icon: Hotel },
        { href: "/businesses", label: "Businesses", icon: Briefcase },
        { href: "/bookings", label: "Bookings", icon: Calendar },
        { href: '/invoices', label: "Invoices", icon: FileText }
    ];

    return (
        <Sidebar className={`${className}`}>
            {/* Brand */}
            <SidebarHeader className="px-5 pt-6 pb-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-white font-bold text-sm">
                        M
                    </div>
                    <div>
                        <h1 className="text-[17px] font-bold tracking-tight text-gray-900 leading-none">Moroccool</h1>
                        <p className="text-[11px] text-gray-400 mt-1">Admin Dashboard</p>
                    </div>
                </div>
            </SidebarHeader>

            {/* Nav label */}
            <SidebarContent className="px-3 pt-5 flex flex-col gap-1">
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Menu</p>
                {navItems.map((item) => {
                    const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
                    return (
                        <SidebarGroup key={item.href} className="p-0">
                            <Link
                                className={`flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium rounded-lg cursor-pointer transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary-container/10 text-primary-container font-semibold border-l-[3px] border-primary-container rounded-l-md'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                href={item.href}
                            >
                                <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-primary-container' : 'text-gray-400'}`} />
                                {item.label}
                            </Link>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="px-3 pb-4 pt-3 border-t border-gray-200 flex flex-col gap-1.5">
                <Link
                    href="/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200
                        ${pathname?.startsWith('/settings')
                            ? 'bg-primary-container/10 text-primary-container font-semibold'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                >
                    <Settings className={`h-[18px] w-[18px] shrink-0 ${pathname?.startsWith('/settings') ? 'text-primary-container' : 'text-gray-400'}`} />
                    Settings
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-[14px] font-medium text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer rounded-lg transition-all duration-200"
                >
                    <LogOut className="h-[18px] w-[18px] shrink-0" />
                    Sign out
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}

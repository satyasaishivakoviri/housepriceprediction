"use client";

import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { Home, Building2, TrendingUp, Users, LogOut } from "lucide-react";

const navItems = [
    {
        name: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        name: "Buy",
        url: "/buyer",
        icon: Building2,
    },
    {
        name: "Sell",
        url: "/seller",
        icon: TrendingUp,
    },
    {
        name: "Agents",
        url: "/agent",
        icon: Users,
    },
];

export default function DashboardLayout({ children }) {
    return (
        <div className="relative min-h-screen">
            <AnimeNavBar
                items={navItems}
                defaultActive="Home"
                className="fixed top-6 left-0 right-0 z-50 pointer-events-none [&>*]:pointer-events-auto"
            />
            {children}
        </div>
    );
}

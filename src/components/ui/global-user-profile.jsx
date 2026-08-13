"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { LayoutDashboard, UserCog, Settings, LogOut, X, User } from "lucide-react";
import { motion } from "framer-motion";

export const GlobalUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/me', {
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to fetch user for profile:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [pathname]);

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Do not show on landing page
    if (pathname === '/') return null;

    const avatarUrl = user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'guest'}`;
    const displayName = user?.name && user.name !== "User" ? user.name : (user?.email?.split('@')[0] || "User");
    const subName = user?.email?.split('@')[0] || "Guest";

    const links = [
        {
            label: "Profile",
            href: "/profile",
            icon: <User className="text-white h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="text-white h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Buyer Portal",
            href: "/buyer",
            icon: <UserCog className="text-white h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Market Analytics",
            href: "/analytics",
            icon: <Settings className="text-white h-5 w-5 flex-shrink-0" />,
        }
    ];

    return (
        <>
            {/* Profile Trigger */}
            <div
                className="fixed top-6 right-4 md:right-6 z-[100]"
                onClick={() => setOpen(true)}
            >
                <div className={cn(
                    "p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-primary/30 transition-all duration-300 group cursor-pointer",
                    loading && "animate-pulse"
                )}>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute top-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white whitespace-nowrap shadow-xl">
                        {displayName}
                    </div>
                </div>
            </div>

            {/* Slide-out Sidebar Panel */}
            <div className={cn(
                "fixed inset-0 z-[110] transition-opacity duration-500 pointer-events-none",
                open ? "bg-black/20 backdrop-blur-sm pointer-events-auto opacity-100" : "opacity-0"
            )} onClick={() => setOpen(false)}>
                <div
                    className={cn(
                        "absolute top-0 right-0 h-full w-[300px] bg-black/60 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)]",
                        open ? "translate-x-0" : "translate-x-full"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Sidebar open={true} animate={false}>
                        <div className="flex flex-col h-full p-8">
                            {/* Profile Header */}
                            <div className="relative pb-10 mb-8 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]">
                                            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-['Anton'] tracking-wide text-white uppercase">{displayName}</span>
                                        <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest">{subName}</span>
                                    </div>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex flex-col gap-3 flex-grow">
                                {links.map((link, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={open ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                    >
                                        <SidebarLink
                                            link={link}
                                            className="hover:bg-primary/20 hover:border-primary/40 border border-white/5 px-4 py-3 rounded-xl transition-all duration-300 group/link text-white font-medium"
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Logout Footer */}
                            <div className="mt-auto pt-8 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all duration-300 text-red-400 group/logout shadow-[0_0_20px_-10px_rgba(239,68,68,0.3)]"
                                >
                                    <LogOut size={18} className="group-hover/logout:-translate-x-1 transition-transform" />
                                    <span className="text-sm font-bold uppercase tracking-wider text-white">Logout</span>
                                </button>
                            </div>
                        </div>
                    </Sidebar>

                    {/* Decorative Background Glow */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
                </div>
            </div>
        </>
    );
};

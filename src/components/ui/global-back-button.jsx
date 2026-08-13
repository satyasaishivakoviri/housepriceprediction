"use client";

import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const GlobalBackButton = () => {
    const router = useRouter();
    const pathname = usePathname();

    // Do not show on the landing page
    if (pathname === '/') return null;

    return (
        <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={() => router.back()}
            className={cn(
                "fixed top-6 left-4 md:left-6 z-[100]",
                "flex items-center justify-center w-12 h-12 rounded-full",
                "bg-black/60 border border-white/20 text-white",
                "hover:text-primary hover:bg-white/10 hover:border-primary/50",
                "transition-all duration-300 backdrop-blur-xl group",
                "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
                "focus:outline-none focus:ring-2 focus:ring-primary/40"
            )}
            title="Go Back"
        >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10"></div>
        </motion.button>
    );
};

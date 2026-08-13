"use client";
import { usePathname } from "next/navigation";

export function GlassOverlay() {
    const pathname = usePathname();

    if (pathname === "/") return null;

    return (
        <div className="fixed inset-0 -z-[5] pointer-events-none bg-black/20 backdrop-blur-xl" />
    );
}

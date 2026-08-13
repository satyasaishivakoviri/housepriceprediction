"use client";

import { usePathname } from "next/navigation";
import { HoverFooter } from "@/components/ui/hover-footer";

export default function FooterWrapper() {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (isAuthPage) return null;

    return <HoverFooter />;
}

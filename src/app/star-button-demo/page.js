"use client";

import { StarButton } from "@/components/ui/star-button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function StarButtonDemo() {
    const { theme } = useTheme();
    const [lightColor, setLightColor] = useState("#FAFAFA");

    useEffect(() => {
        setLightColor(theme === "dark" ? "#FAFAFA" : "#FF2056");
    }, [theme]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground gap-4">
            <StarButton lightColor={lightColor} className="rounded-3xl">
                Star Button
            </StarButton>
        </div>
    );
}

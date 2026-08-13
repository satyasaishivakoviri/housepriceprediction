"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    circleClassName?: string;
}

export function FlowButton({ text = "Start Analysis", className, circleClassName, ...props }: FlowButtonProps) {
    return (
        <button
            className={cn(
                "group relative flex items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] px-8 py-3 text-sm font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] active:scale-[0.95]",
                // Default adapted for dark theme (overridable)
                "border-white/20 bg-transparent text-white hover:border-transparent hover:text-black",
                className
            )}
            {...props}
        >
            {/* Circle (Background Layer) */}
            <span className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                "bg-white", // Default color
                circleClassName
            )}></span>

            {/* Left arrow (arr-2) */}
            <ArrowRight
                className="absolute w-4 h-4 left-[-25%] stroke-current fill-none z-[20] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            />

            {/* Text */}
            <span className="relative z-[10] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
                {text}
            </span>

            {/* Right arrow (arr-1) */}
            <ArrowRight
                className="absolute w-4 h-4 right-4 stroke-current fill-none z-[20] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            />
        </button>
    );
}

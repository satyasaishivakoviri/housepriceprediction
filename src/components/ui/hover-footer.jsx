"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import { GooeyText } from "./gooey-text-morphing";

export const TextHoverEffect = ({
    text,
    duration,
    className,
}) => {
    const svgRef = useRef(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

    useEffect(() => {
        if (svgRef.current && cursor.x !== null && cursor.y !== null) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
            const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
            setMaskPosition({
                cx: `${cxPercentage}%`,
                cy: `${cyPercentage}%`,
            });
        }
    }, [cursor]);

    return (
        <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 400 100"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
            className={cn("select-none uppercase cursor-pointer", className)}
        >
            <defs>
                <linearGradient
                    id="textGradient"
                    gradientUnits="userSpaceOnUse"
                    cx="50%"
                    cy="50%"
                    r="25%"
                >
                    {hovered && (
                        <>
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="25%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="75%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </>
                    )}
                </linearGradient>

                <motion.radialGradient
                    id="revealMask"
                    gradientUnits="userSpaceOnUse"
                    r="20%"
                    initial={{ cx: "50%", cy: "50%" }}
                    animate={maskPosition}
                    transition={{ duration: duration ?? 0, ease: "easeOut" }}
                >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </motion.radialGradient>
                <mask id="textMask">
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#revealMask)"
                    />
                </mask>
            </defs>
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.3"
                className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800"
                style={{ opacity: hovered ? 0.7 : 0 }}
            >
                {text}
            </text>
            <motion.text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.3"
                className="fill-transparent stroke-primary font-[helvetica] text-7xl font-bold 
        dark:stroke-primary/60"
                initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
                animate={{
                    strokeDashoffset: 0,
                    strokeDasharray: 1000,
                }}
                transition={{
                    duration: 4,
                    ease: "easeInOut",
                }}
            >
                {text}
            </motion.text>
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="url(#textGradient)"
                strokeWidth="0.3"
                mask="url(#textMask)"
                className="fill-transparent font-[helvetica] text-7xl font-bold"
            >
                {text}
            </text>
        </svg>
    );
};


export const FooterBackgroundGradient = () => {
    return (
        <div
            className="absolute inset-0 z-0"
            style={{
                background:
                    "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, rgba(59,130,246,0.2) 100%)",
            }}
        />
    );
};

const FOOTER_TEXTS = ["HOMIENEST", "SMARTER", "PROPERTY", "DECISIONS"];

export function HoverFooter() {
    // Footer link data
    const footerLinks = [
        {
            title: "Platform",
            links: [
                { label: "AI Predictor", href: "/predict" },
                { label: "Marketplace", href: "/listings" },
                { label: "Analytics", href: "/analytics" },
                { label: "Dashboard", href: "/dashboard" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/about" },
                {
                    label: "Get Started",
                    href: "/login",
                },
            ],
        },
    ];

    // Contact info data
    const contactInfo = [
        {
            icon: <span className="material-symbols-outlined text-primary text-lg">mail</span>,
            text: "saitrishankb9@gmail.com",
            href: "mailto:saitrishankb9@gmail.com",
        },
        {
            icon: <span className="material-symbols-outlined text-primary text-lg">call</span>,
            text: "+91 81793 69677",
            href: "tel:+918179369677",
        },
        {
            icon: <span className="material-symbols-outlined text-primary text-lg">location_on</span>,
            text: "India",
        },
    ];

    // Social media icons
    const socialLinks = [
        { icon: "public", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61587374589698" },
        { icon: "mail", label: "Email", href: "mailto:saitrishankb9@gmail.com" },
    ];

    return (
        <footer className="bg-[#0F0F11] relative h-fit rounded-t-3xl overflow-hidden pt-10 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 z-40 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-12 pb-8">
                    {/* Brand section */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-lg">home</span>
                            </div>
                            <span className="text-white text-3xl font-bold tracking-tight">HomieNest</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400">
                            India&apos;s most accurate AI-powered platform for house price forecasting and smart property investment.
                        </p>
                    </div>

                    {/* Footer link sections */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-white text-lg font-semibold mb-6">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label} className="relative">
                                        <a
                                            href={link.href}
                                            className="text-slate-400 hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                        {link.pulse && (
                                            <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact section */}
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-6">
                            Contact Us
                        </h4>
                        <ul className="space-y-4">
                            {contactInfo.map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-slate-400">
                                    {item.icon}
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="hover:text-[#3ca2fa] transition-colors">
                                            {item.text}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-full h-[80px] md:h-[250px] mt-[-20px] mb-6 pointer-events-auto flex items-center justify-center overflow-hidden">
                    <GooeyText
                        texts={FOOTER_TEXTS}
                        morphTime={1.5}
                        cooldownTime={3}
                        className="font-bold h-full w-full cursor-pointer opacity-20 hover:opacity-60 transition-opacity duration-500"
                        textClassName="text-[15.2vw] leading-none font-black tracking-tighter text-primary"
                    />
                </div>

                <hr className="border-t border-gray-800 mb-4" />

                {/* Footer bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0 text-gray-500 pb-2">
                    {/* Social icons */}
                    <div className="flex space-x-6">
                        {socialLinks.map(({ icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="hover:text-[#3ca2fa] transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">{icon}</span>
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p className="text-center md:text-left">
                        &copy; {new Date().getFullYear()} HomieNest. All rights reserved.
                    </p>
                </div>
            </div>

            <FooterBackgroundGradient />
        </footer>
    );
}

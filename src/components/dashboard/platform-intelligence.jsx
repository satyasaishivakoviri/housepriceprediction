"use client";

import { motion } from "framer-motion";
import { Map, TrendingUp, ShieldCheck, PieChart, Heart, GitCompare, ArrowRight, TrainFront, Car, School, Hospital, Building2, ShoppingBag } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-wrapper";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const features = [
    {
        icon: Map,
        title: "Map-Aware Pricing",
        description: "Analyze property value at street and micro-market level."
    },
    {
        icon: TrendingUp,
        title: "Future Price Forecast",
        description: "Project appreciation trends across upcoming years."
    },
    {
        icon: ShieldCheck,
        title: "Confidence Score",
        description: "Indicate reliability based on data strength and market activity."
    },
    {
        icon: PieChart,
        title: "ROI & Rental Intelligence",
        description: "Understand income potential and investment return."
    },
    {
        icon: Heart,
        title: "Lifestyle & Livability",
        description: "Evaluate transport, schools, hospitals, retail, safety."
    },
    {
        icon: GitCompare,
        title: "Smart Comparison",
        description: "Compare properties across valuation and growth metrics."
    }
];

const infrastructureSignals = [
    {
        icon: TrainFront,
        title: "Metro & Transit Access",
        description: "Measure influence of current and upcoming rail connectivity."
    },
    {
        icon: Car,
        title: "Highway & Road Network",
        description: "Evaluate commute efficiency and regional accessibility."
    },
    {
        icon: School,
        title: "Education Hubs",
        description: "Proximity to schools and universities that drive housing demand."
    },
    {
        icon: Hospital,
        title: "Healthcare Access",
        description: "Availability of hospitals and emergency infrastructure."
    },
    {
        icon: Building2,
        title: "Business & Employment Zones",
        description: "Impact of IT parks and commercial clusters."
    },
    {
        icon: ShoppingBag,
        title: "Retail & Lifestyle Growth",
        description: "Shopping, entertainment, and urban expansion indicators."
    }
];

export function PlatformIntelligence() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* BLOCK 1 – INTRO */}
                <FadeIn>
                    <div className="mb-20">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                            About The Platform
                        </span>
                        <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-white">
                            Smarter Property Decisions <span className="text-white/40">Through Data</span>
                        </h2>
                        <p className="text-white/60 text-lg md:text-xl max-w-3xl font-light leading-relaxed">
                            Our system uses advanced analytics, live market behavior, and micro-location intelligence to deliver accurate valuations, forecasts, and investment guidance for every type of user.
                        </p>
                    </div>
                </FadeIn>

                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32" stagger={0.1}>
                    {features.map((feature, i) => (
                        <StaggerItem key={i} className="h-full">
                            <div className="relative h-full rounded-2xl border border-white/5 p-1.5 md:p-2">
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={3}
                                />
                                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 shadow-sm md:p-8">
                                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2 text-white group-hover:text-primary transition-colors">
                                            <feature.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-medium text-white">{feature.title}</h3>
                                            <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>

                {/* BLOCK 3 – INFRASTRUCTURE INTELLIGENCE */}
                <FadeIn>
                    <div className="mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6">
                            Location Intelligence
                        </span>
                        <h3 className="text-3xl md:text-4xl font-light mb-4 text-white">Infrastructure Drives Property Value</h3>
                        <p className="text-white/60 font-light max-w-2xl">
                            We continuously track transportation upgrades, connectivity improvements, education and healthcare access, and commercial development to understand why an area may appreciate in the future.
                        </p>
                    </div>
                </FadeIn>

                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24" stagger={0.15}>
                    {infrastructureSignals.map((item, i) => (
                        <StaggerItem key={i} className="h-full">
                            <div className="relative h-full rounded-2xl border border-white/5 p-1.5 md:p-2">
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={3}
                                />
                                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 shadow-sm md:p-8">
                                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                                            <item.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-medium text-white">{item.title}</h3>
                                            <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>

                <FadeIn>
                    <p className="text-center text-white/40 text-sm font-medium tracking-wide uppercase mb-32">
                        We translate development into demand, and demand into valuation clarity.
                    </p>
                </FadeIn>

                {/* BLOCK 4 – MISSION STRIP */}
                <FadeIn>
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.02] to-transparent p-12 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400 mb-6">Our Technology</h2>
                            <p className="text-2xl md:text-4xl font-light text-white leading-tight max-w-4xl mx-auto">
                                Powered by <span className="text-indigo-400">Neural Networks</span> & Live Data
                            </p>
                            <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg font-light">
                                Processing over <span className="text-white">1M+ daily data points</span> across 500+ micro-markets to deliver institutional-grade precision for every user.
                            </p>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </section>
    );
}

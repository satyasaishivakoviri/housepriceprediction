"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { BlurFrame } from '@/components/ui/blur-frame';
import { FadeIn, StaggerChildren, StaggerItem, CountUp } from '@/components/ui/motion-wrapper';
import { PlatformIntelligence } from '@/components/dashboard/platform-intelligence';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { AnimatedText } from '@/components/ui/animated-underline-text-one';



const roles = [
    {
        id: 'buyers',
        title: 'Buyers',
        subtitle: 'Find Your Dream Home',
        description: 'AI-powered price predictions, neighborhood insights, and personalized property recommendations.',
        icon: 'home_work',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        link: '/buyer',
        cta: 'Start Searching'
    },
    {
        id: 'sellers',
        title: 'Sellers',
        subtitle: 'Maximize Your Returns',
        description: 'Market analytics, competitive pricing strategies, and demand forecasting to help you sell smarter.',
        icon: 'trending_up',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        link: '/seller',
        cta: 'Analyze Market'
    },
    {
        id: 'agents',
        title: 'Agents',
        subtitle: 'Close Deals Faster',
        description: 'Comprehensive market intelligence, client-ready reports, and listing management tools.',
        icon: 'handshake',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        link: '/agent',
        cta: 'Explore Tools'
    },
];

export default function DashboardPage() {
    const [greeting, setGreeting] = useState('Welcome');

    useEffect(() => {


        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    return (
        <AuthGuard>
            <div className="relative min-h-screen text-white">

                {/* Background Animation - Same as Landing Page */}
                <div className="absolute inset-0 z-0">
                    <BackgroundPaths title="" showCta={false} />
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">

                    {/* Header Section */}

                    <FadeIn>
                        <div className="mb-20 text-center">
                            <AnimatedText
                                text="HOUSE PRICE PREDICTION"
                                className="mb-8"
                                textClassName="text-4xl md:text-7xl font-display font-bold tracking-tight text-white drop-shadow-2xl"
                                underlineClassName="text-primary hidden md:block"
                            />
                            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary mb-6 backdrop-blur-md">
                                {greeting}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
                                Your Real Estate <span className="text-primary font-normal">Command Center</span>
                            </h1>
                            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                                Access powerful AI tools, market insights, and personalized recommendations tailored to your role.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Platform Intelligence Section */}
                    <PlatformIntelligence />

                    {/* Role Selection Cards */}
                    <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" stagger={0.1}>
                        {roles.map((role) => (
                            <StaggerItem key={role.id} className="h-full">
                                <Link href={role.link} className="relative block h-full group rounded-[2rem]">
                                    <div className="relative h-full rounded-[2rem] border border-white/5 p-1 transition-transform duration-300 hover:-translate-y-2">
                                        <GlowingEffect
                                            spread={40}
                                            glow={true}
                                            disabled={false}
                                            proximity={64}
                                            inactiveZone={0.01}
                                            borderWidth={3}
                                        />
                                        <div className={`relative h-full p-8 rounded-[1.8rem] border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden z-20`}>
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${role.bg} ${role.color}`}>
                                                <span className="material-symbols-outlined text-3xl">{role.icon}</span>
                                            </div>
                                            <h3 className="text-2xl font-normal text-white mb-2 group-hover:text-primary transition-colors">{role.title}</h3>
                                            <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">{role.subtitle}</p>
                                            <p className="text-white/60 text-sm leading-relaxed mb-8">{role.description}</p>
                                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/80 group-hover:text-primary transition-colors">
                                                {role.cta}
                                                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerChildren>

                    {/* Stats Section */}
                    <FadeIn delay={0.4}>
                        <div className="relative rounded-2xl border border-white/5 p-1">
                            <GlowingEffect
                                spread={40}
                                glow={true}
                                disabled={false}
                                proximity={64}
                                inactiveZone={0.01}
                                borderWidth={3}
                            />
                            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5 rounded-xl p-8 backdrop-blur-md overflow-hidden">
                                {[
                                    { value: '98%', label: 'Accuracy', icon: 'verified' },
                                    { value: '150+', label: 'Cities', icon: 'location_city' },
                                    { value: '1K+', label: 'Users', icon: 'group' },
                                    { value: '50K+', label: 'Predictions', icon: 'query_stats' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-3xl md:text-4xl font-light text-white mb-1"><CountUp target={stat.value} /></div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-sm">{stat.icon}</span>
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </AuthGuard>
    );
}

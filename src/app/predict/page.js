"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
// Import TabBar from RoleTheme -- correct relative path from src/app/predictor/page.js is ../../components/ui/RoleTheme
import { TabBar } from '@/components/ui/RoleTheme';

export default function Predictor() {
    const [activeRole, setActiveRole] = useState('buyer');

    const roles = [
        { id: 'buyer', label: 'For Buyers', icon: 'shopping_cart', badge: 0 },
        { id: 'seller', label: 'For Sellers', icon: 'sell', badge: 0 },
        { id: 'agent', label: 'For Agents', icon: 'real_estate_agent', badge: 0 },
    ];

    const content = {
        buyer: {
            theme: 'text-primary',
            bgTheme: 'from-slate-900 to-red-950',
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            title: 'Find Your Dream Price',
            desc: 'Don’t overpay. Use AI to predict the fair market value of any property before you make an offer.',
            features: [
                { icon: 'price_check', title: 'Fair Value Check', desc: 'Instant price estimation based on 50+ parameters.' },
                { icon: 'trending_up', title: 'Future Appreciation', desc: '5-year growth forecast for the neighborhood.' },
                { icon: 'savings', title: 'Affordability Calc', desc: 'EMI and down payment planning based on your budget.' },
            ],
            ctaText: 'Start Buyer Prediction',
            ctaLink: '/buyer',
        },
        seller: {
            theme: 'text-emerald-600',
            bgTheme: 'from-slate-900 to-emerald-950',
            iconBg: 'bg-emerald-600/10',
            iconColor: 'text-emerald-600',
            title: 'Maximize Your Sale',
            desc: 'Know exactly what your property is worth in today’s market. Price it right to sell faster.',
            features: [
                { icon: 'currency_rupee', title: 'Instant Valuation', desc: 'Real-time estimate based on recent comparable sales.' },
                { icon: 'timer', title: 'Time-to-Sell Est', desc: 'Predicted days on market for your price point.' },
                { icon: 'construction', title: 'Renovation ROI', desc: 'See how upgrades impact your selling price.' },
            ],
            ctaText: 'Get Seller Estimate',
            ctaLink: '/seller',
        },
        agent: {
            theme: 'text-blue-600',
            bgTheme: 'from-slate-900 to-blue-950',
            iconBg: 'bg-blue-600/10',
            iconColor: 'text-blue-600',
            title: 'Market Command Center',
            desc: 'Empower your clients with data. Generate professional valuation reports and spot hot leads.',
            features: [
                { icon: 'leaderboard', title: 'Lead Scoring', desc: 'Identify high-intent buyers and sellers in your area.' },
                { icon: 'query_stats', title: 'Hyper-local Trends', desc: 'Micro-market analysis for specific streets/projects.' },
                { icon: 'description', title: 'Client Reports', desc: 'White-labeled PDF valuation reports for your clients.' },
            ],
            ctaText: 'Access Agent Dashboard',
            ctaLink: '/agent',
        },
    };

    const current = content[activeRole];

    return (
        <AuthGuard>
            <div className={`min-h-screen pt-28 pb-20 px-6 md:px-12 transition-colors duration-500 bg-gradient-to-b ${current.bgTheme}`}>
                <div className="max-w-[900px] mx-auto text-center">

                    {/* Role Switcher */}
                    <div className="flex justify-center mb-12">
                        <TabBar
                            tabs={roles}
                            active={activeRole}
                            onChange={setActiveRole}
                            accent={activeRole === 'seller' ? '#059669' : activeRole === 'agent' ? '#2563eb' : '#c93a2a'}
                        />
                    </div>

                    {/* Animated Content Container */}
                    <div key={activeRole} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className={`w-24 h-24 mx-auto mb-8 rounded-3xl ${current.iconBg} flex items-center justify-center shadow-lg shadow-black/5`}>
                            <span className={`material-symbols-outlined text-5xl ${current.iconColor} animate-pulse-slow`}>
                                {roles.find(r => r.id === activeRole).icon}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-['Anton'] text-navy tracking-tight mb-6">
                            {current.title}
                        </h1>
                        <p className="text-lg text-navy/60 font-medium max-w-[600px] mx-auto mb-12 leading-relaxed">
                            {current.desc}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                            {current.features.map((f, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <span className={`material-symbols-outlined text-3xl mb-4 block ${current.iconColor}`}>{f.icon}</span>
                                    <h3 className="text-navy font-bold text-lg mb-2">{f.title}</h3>
                                    <p className="text-sm text-navy/50 leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>

                        <Link
                            href={current.ctaLink}
                            className={`inline-flex items-center gap-3 text-white px-10 py-5 rounded-2xl text-sm font-bold uppercase tracking-[0.15em] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group ${activeRole === 'seller' ? 'bg-emerald-600 hover:bg-emerald-700' : activeRole === 'agent' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-red-700'}`}
                        >
                            {current.ctaText}
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}

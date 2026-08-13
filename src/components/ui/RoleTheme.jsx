"use client";
import React from 'react';

// Shared tab bar, stat card, and theme wrappers used across all role pages

export function TabBar({ tabs, active, onChange, accent = '#c93a2a' }) {
    return (
        <div className="flex gap-0.5 rounded-2xl p-1.5 mb-8 overflow-x-auto scrollbar-hide" style={{ background: `rgba(255,255,255,0.03)`, border: `1px solid rgba(255,255,255,0.1)` }}>
            {tabs.map(tab => (
                <button key={tab.id} onClick={() => onChange(tab.id)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap select-none ${active === tab.id ? 'text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'text-white/40 hover:text-white/60'} ${tab.highlight ? 'ring-1 ring-red-500/30 shadow-[0_0_15px_rgba(201,58,42,0.1)]' : ''}`}
                    style={{
                        background: active === tab.id ? 'rgba(255,255,255,0.1)' : tab.highlight ? 'rgba(201,58,42,0.05)' : 'transparent',
                        color: active === tab.id ? '#fff' : undefined,
                        border: active === tab.id ? '1px solid rgba(255,255,255,0.2)' : tab.highlight ? '1px solid rgba(201,58,42,0.2)' : '1px solid transparent',
                        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}>
                    <span className={`material-symbols-outlined text-[15px] ${tab.highlight ? 'text-red-500' : ''}`} style={{ fontVariationSettings: active === tab.id ? "'FILL' 1" : "'FILL' 0", transition: 'all 0.3s ease' }}>{tab.icon}</span>
                    {tab.label}
                    {tab.badge > 0 && <span className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center" style={{ background: accent }}>{tab.badge}</span>}
                </button>
            ))}
        </div>
    );
}

export function StatCard({ icon, label, value, trend, sub, color = '#c93a2a' }) {
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                    <span className="material-symbols-outlined text-xl" style={{ color }}>{icon}</span>
                </div>
                {trend && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${parseFloat(trend) > 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{parseFloat(trend) > 0 ? '↑' : '↓'} {Math.abs(parseFloat(trend))}%</span>}
                {sub && <span className="text-[10px] font-bold text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">{sub}</span>}
            </div>
            <div className="text-2xl font-['Anton'] text-white tracking-wide">{value}</div>
            <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mt-1">{label}</div>
        </div>
    );
}

export function SectionHeader({ icon, title, subtitle, accent = '#c93a2a' }) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: accent, boxShadow: `0 8px 24px ${accent}40` }}>
                    <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
                </div>
                <div>
                    <h1 className="text-3xl font-['Anton'] text-white tracking-wide uppercase">{title}</h1>
                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em]">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

export function EmptyState({ icon, title, subtitle }) {
    return (
        <div className="text-center py-24 text-white/20">
            <span className="material-symbols-outlined text-6xl mb-4 block">{icon}</span>
            <p className="font-bold text-base text-white/40">{title}</p>
            {subtitle && <p className="text-xs mt-2 text-white/30">{subtitle}</p>}
        </div>
    );
}

export function ProgressRing({ value, size = 56, color = '#22c55e', label }) {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <div className="text-center">
            <div className="relative mx-auto" style={{ width: size, height: size }}>
                <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${value / 100 * circ} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{value}</span>
            </div>
            {label && <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider mt-1">{label}</div>}
        </div>
    );
} export function FieldGroup({ label, children }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">{label}</label>
            {children}
        </div>
    );
}

export function ActionButton({ onClick, children, variant = 'primary', className = '' }) {
    const variants = {
        primary: 'bg-primary text-white border-primary/20 hover:bg-primary/90',
        secondary: 'bg-white/5 text-white border-white/10 hover:bg-white/10',
        tertiary: 'bg-transparent text-white/40 border-transparent hover:text-white hover:bg-white/5'
    };

    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}



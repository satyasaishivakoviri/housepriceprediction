"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoverIndicator, setHoverIndicator] = useState({ width: 0, left: 0, opacity: 0 });
    const [activeIndicator, setActiveIndicator] = useState({ width: 0, left: 0 });
    const navRef = useRef(null);
    const linkRefs = useRef({});
    const pathname = usePathname();

    const isPublicPage = ['/', '/about', '/login', '/legal', '/contact', '/listings', '/predict', '/analytics'].includes(pathname);
    const isLoginPage = pathname === '/login';

    // Smooth scroll handler with requestAnimationFrame
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 30);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { href: '/about', label: 'About', icon: 'info' },
        { href: '/login', label: 'Login', icon: 'login' },
        { href: '/contact', label: 'Connect', icon: 'connect_without_contact' },
        { href: '/seller', label: 'Sell', icon: 'sell' },
        { href: '/agent', label: 'Agent', icon: 'support_agent' },
        { href: '/admin', label: 'Admin', icon: 'admin_panel_settings' },
    ];

    // Position the active indicator on the current page link
    const updateActiveIndicator = useCallback(() => {
        const activeLink = linkRefs.current[pathname];
        const parent = navRef.current;
        if (activeLink && parent) {
            const lr = activeLink.getBoundingClientRect();
            const pr = parent.getBoundingClientRect();
            setActiveIndicator({ width: lr.width - 12, left: lr.left - pr.left + 6 });
        }
    }, [pathname]);

    useEffect(() => {
        updateActiveIndicator();
        window.addEventListener('resize', updateActiveIndicator);
        return () => window.removeEventListener('resize', updateActiveIndicator);
    }, [updateActiveIndicator]);

    // Hover indicator tracking
    const handleMouseEnter = useCallback((e) => {
        const parent = navRef.current;
        if (!parent) return;
        const lr = e.currentTarget.getBoundingClientRect();
        const pr = parent.getBoundingClientRect();
        setHoverIndicator({ width: lr.width - 4, left: lr.left - pr.left + 2, opacity: 1 });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoverIndicator(prev => ({ ...prev, opacity: 0 }));
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isLoginPage ? '-translate-y-full opacity-0 pointer-events-none' : ''} ${scrolled ? 'py-2' : 'py-4'}`}
            id="navbar"
        >
            <div
                className={`max-w-[1400px] mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled
                    ? 'bg-white/5 backdrop-blur-xl rounded-2xl mx-4 md:mx-8 px-6 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-white/5'
                    : 'px-6 md:px-12 py-1'
                    }`}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group relative select-none">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-red-700 flex items-center justify-center group-hover:scale-105 group-hover:rotate-2 transition-all duration-400 ease-out shadow-lg shadow-primary/20 group-hover:shadow-primary/35">
                            <Image src="/assets/logo.png" alt="HomieNest" width={22} height={22} className="h-5.5 w-5.5 object-contain" />
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-primary/15 blur-xl group-hover:blur-2xl transition-all duration-500 -z-10" />
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[12px] font-black text-navy tracking-[0.12em] leading-none">HOUSE PRICE PREDICTION</span>
                        <span className="text-[8px] font-semibold text-navy/35 tracking-[0.3em] leading-none mt-1">HACKATHON EDITION</span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div
                    className="hidden md:flex items-center gap-0 relative"
                    ref={navRef}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Hover highlight pill */}
                    <div
                        className="absolute top-0 h-full rounded-xl bg-navy/[0.04] pointer-events-none"
                        style={{
                            width: hoverIndicator.width || 0,
                            left: hoverIndicator.left || 0,
                            opacity: hoverIndicator.opacity || 0,
                            transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    />
                    {/* Active underline */}
                    <div
                        className="absolute bottom-0 h-[2px] bg-gradient-to-r from-primary via-red-500 to-primary rounded-full pointer-events-none"
                        style={{
                            width: activeIndicator.width || 0,
                            left: activeIndicator.left || 0,
                            opacity: activeIndicator.width ? 1 : 0,
                            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    />

                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href + link.label}
                                href={link.href}
                                ref={el => { linkRefs.current[link.href] = el; }}
                                onMouseEnter={handleMouseEnter}
                                className={`relative px-4 py-3 text-[12px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 select-none ${isActive
                                    ? 'text-primary'
                                    : 'text-navy/50 hover:text-navy/90'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center gap-1.5">
                                    <span className={`material-symbols-outlined text-[15px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                                    >{link.icon}</span>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA + Mobile Toggle */}
                <div className="flex items-center gap-3">


                    <Link
                        href={isPublicPage ? '/login' : '/dashboard'}
                        className="group/cta relative overflow-hidden bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] flex items-center gap-2 transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                    >
                        <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover/cta:text-white">
                            {isPublicPage ? 'Get Started' : 'Dashboard'}
                            <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover/cta:translate-x-0.5">arrow_forward</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-red-700 translate-x-[-101%] group-hover/cta:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-navy/5 transition-all duration-300 active:scale-95"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-[5px] w-[18px]">
                            <span className={`block h-[1.5px] bg-navy rounded-full transition-all duration-400 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                            <span className={`block h-[1.5px] bg-navy rounded-full transition-all duration-400 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                            <span className={`block h-[1.5px] bg-navy rounded-full transition-all duration-400 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-3 right-3 mt-2 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileMenuOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}>
                <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_48px_rgba(0,0,0,0.10)]">
                    <div className="flex flex-col py-1.5">
                        {links.map((link, i) => (
                            <Link
                                key={link.href + link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-6 py-3.5 text-[13px] font-semibold tracking-[0.08em] uppercase transition-all duration-200 ${pathname === link.href
                                    ? 'text-primary bg-primary/5'
                                    : 'text-navy/60 hover:text-navy hover:bg-navy/[0.03]'
                                    }`}
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: pathname === link.href ? "'FILL' 1" : "'FILL' 0" }}>{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-navy/5 mt-1.5 pt-3 px-4 pb-3">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300"
                            >
                                Get Started
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

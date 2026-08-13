"use client";
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const pageRef = useRef(null);

    useEffect(() => {
        // ... (existing useEffect code is fine, but shorter to just import useRouter and insert button)
        const ctx = gsap.context(() => {
            // Reveal-up animation for each section
            gsap.utils.toArray('.reveal-section').forEach((section) => {
                const items = section.querySelectorAll('.ru');
                if (items.length === 0) return;

                gsap.set(items, { y: 80, opacity: 0 });

                ScrollTrigger.create({
                    trigger: section,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.to(items, {
                            y: 0,
                            opacity: 1,
                            duration: 0.9,
                            stagger: 0.12,
                            ease: 'power3.out',
                        });
                    },
                    onLeaveBack: () => {
                        gsap.to(items, {
                            y: 80,
                            opacity: 0,
                            duration: 0.4,
                            stagger: 0.05,
                            ease: 'power2.in',
                        });
                    },
                });
            });

            // Hero entrance (instant, not scroll-triggered)
            gsap.from('.about-hero-enter', {
                y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="min-h-screen pt-28 pb-20 px-6 md:px-12">
            <div className="max-w-[900px] mx-auto">
                {/* Hero — enters on page load */}
                <div className="text-center mb-16">
                    <div className="about-hero-enter w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(var(--primary-rgb),0.3)]">
                        <span className="material-symbols-outlined text-4xl text-primary">apartment</span>
                    </div>
                    <h1 className="about-hero-enter text-4xl md:text-5xl font-['Anton'] text-white tracking-wide mb-4">About HomieNest</h1>
                    <p className="about-hero-enter text-sm text-white/40 font-medium max-w-[500px] mx-auto leading-relaxed">
                        India&apos;s smartest AI-powered real estate platform — helping buyers, sellers, and agents make data-driven property decisions.
                    </p>
                </div>

                {/* Value props — each card rises from below */}
                <div className="reveal-section grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
                    {[
                        {
                            icon: 'psychology',
                            title: 'AI-Powered',
                            desc: 'Machine learning models trained on millions of property transactions for accurate valuations.',
                            img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
                            color: 'text-blue-500',
                            bg: 'bg-blue-500/10',
                            border: 'border-blue-500/20'
                        },
                        {
                            icon: 'location_city',
                            title: 'India-Wide',
                            desc: 'Coverage across 30+ major Indian cities with hyper-local neighborhood intelligence.',
                            img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=200&fit=crop',
                            color: 'text-orange-500',
                            bg: 'bg-orange-500/10',
                            border: 'border-orange-500/20'
                        },
                        {
                            icon: 'security',
                            title: 'Trusted Data',
                            desc: 'Real-time market data, verified listings, and transparent pricing — no hidden fees.',
                            img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
                            color: 'text-emerald-500',
                            bg: 'bg-emerald-500/10',
                            border: 'border-emerald-500/20'
                        },
                    ].map(v => (
                        <div key={v.icon} className={`ru ${v.bg} backdrop-blur-sm border ${v.border} rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <div className="relative h-36 overflow-hidden">
                                <img src={v.img} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" loading="lazy" />
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent`} />
                            </div>
                            <div className="p-6 relative">
                                <div className={`w-10 h-10 rounded-xl ${v.bg} border ${v.border} flex items-center justify-center mb-3`}>
                                    <span className={`material-symbols-outlined text-xl ${v.color}`}>{v.icon}</span>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-2">{v.title}</h3>
                                <p className="text-[11px] text-white/60 leading-relaxed">{v.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mission — each part rises from below */}
                <div className="reveal-section bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 text-center mb-16">
                    <h2 className="ru text-2xl font-['Anton'] text-white tracking-wide mb-4">Our Mission</h2>
                    <p className="ru text-sm text-white/50 max-w-[600px] mx-auto leading-relaxed">
                        To democratize real estate intelligence in India. We believe every buyer, seller, and agent deserves access to the same powerful analytics and AI tools used by the industry&apos;s top players — all in one beautifully designed platform.
                    </p>
                </div>

                {/* CTA */}
                <div className="reveal-section text-center">
                    <div className="ru">
                        <Link href="/login" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                            Start Your Journey
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

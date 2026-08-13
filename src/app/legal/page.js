"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, FileText, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { BackgroundPaths } from '@/components/ui/background-paths';

export default function LegalPage() {
    const [activeTab, setActiveTab] = useState('privacy');

    return (
        <div className="relative min-h-screen text-white bg-[#0a0a0c] selection:bg-primary/30">
            <div className="absolute inset-0 z-0 opacity-30">
                <BackgroundPaths title="" showCta={false} />
            </div>

            <div className="relative z-10 pt-28 pb-20 px-6 md:px-12 max-w-[1100px] mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                <div className="text-center mb-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-['Anton'] tracking-wide text-white mb-3">Legal & Compliance</h1>
                    <p className="text-white/50 text-sm max-w-lg mx-auto">
                        Transparent policies governing privacy, service terms, and RERA compliance across HomieNest.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-10 border-b border-white/10">
                    {[
                        { id: 'privacy', label: 'Privacy Policy', icon: Lock },
                        { id: 'terms', label: 'Terms of Service', icon: FileText },
                        { id: 'rera', label: 'RERA Compliance', icon: CheckCircle },
                    ].map(t => {
                        const Icon = t.icon;
                        const active = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${active ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-white/40 hover:text-white/80'}`}
                            >
                                <Icon size={16} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 leading-relaxed text-white/80 text-sm space-y-6">
                    {activeTab === 'privacy' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
                            <p>
                                At HomieNest, protecting your personal information and maintaining your privacy is our core priority.
                                This Privacy Policy details how we collect, process, and safeguard your data when using our AI valuation engine, property marketplace, and advisory portals.
                            </p>
                            
                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">1. Information We Collect</h3>
                            <ul className="list-disc pl-5 space-y-2 text-white/70">
                                <li><strong>Account Data:</strong> Name, email address, phone number, and authentication details when you sign up.</li>
                                <li><strong>Property Valuation Inputs:</strong> Locality, square footage, bedroom counts, floor positions, and structural parameters entered into the AI predictor.</li>
                                <li><strong>Interaction History:</strong> Saved listings, tour requests, submitted offers, and communication preference history stored securely.</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">2. How We Use Your Data</h3>
                            <p>
                                We utilize your information strictly to generate accurate AI valuations, personalize property recommendations, connect buyers with verified agents/sellers, and enhance platform security. We never sell your personal contact details to unverified third parties.
                            </p>

                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">3. Data Security & Encryption</h3>
                            <p>
                                All sensitive transactions, tokenized authentication tokens, and user inputs are protected using SSL/TLS 256-bit encryption. Access controls restrict raw data access exclusively to authenticated users.
                            </p>
                        </div>
                    )}

                    {activeTab === 'terms' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
                            <p>
                                Welcome to HomieNest. By accessing our website, platform tools, AI estimator, or marketplace services, you agree to comply with the following binding terms and conditions.
                            </p>

                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">1. Platform Scope & AI Valuations</h3>
                            <p>
                                HomieNest provides AI-driven real estate pricing estimates based on historical machine learning algorithms and macro-market datasets. While our accuracy engine targets industry-leading benchmark rates, estimates serve as advisory references and should be validated alongside certified RERA real estate valuations.
                            </p>

                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">2. User Responsibilities</h3>
                            <ul className="list-disc pl-5 space-y-2 text-white/70">
                                <li>Sellers must ensure all listed properties contain truthful architectural and legal disclosures.</li>
                                <li>Buyers and agents must maintain respectful communication and adhere to scheduled property visit appointments.</li>
                                <li>Users agree not to attempt unauthorized scraping, reverse engineering, or system exploitation of platform APIs.</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">3. Account Termination</h3>
                            <p>
                                HomieNest reserves the right to suspend or terminate accounts that violate community safety standards, submit fraudulent property listings, or engage in unauthorized platform misuse.
                            </p>
                        </div>
                    )}

                    {activeTab === 'rera' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-white mb-4">RERA Compliance Framework</h2>
                            <p>
                                HomieNest strictly adheres to the Real Estate (Regulation and Development) Act, 2016 (RERA) to promote accountability and transparency across all residential and commercial real estate transactions in India.
                            </p>

                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">1. Verified RERA Registrations</h3>
                            <p>
                                New builder launches and developer projects listed on HomieNest undergo rigorous validation against state RERA authority databases (including MahaRERA, Karnataka RERA, and Haryana RERA). Valid RERA registration numbers are prominently displayed on verified listings.
                            </p>

                            <h3 className="text-lg font-semibold text-white pt-4 border-t border-white/10">2. Consumer Safeguards</h3>
                            <ul className="list-disc pl-5 space-y-2 text-white/70">
                                <li>Complete carpet area disclosures standard across all project valuations.</li>
                                <li>Sanctioned plan verification and clear title status indicators.</li>
                                <li>Agent licensing tracking for registered real estate professionals.</li>
                            </ul>

                            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                <CheckCircle size={18} /> Fully Aligned with RERA Guidelines 2026
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

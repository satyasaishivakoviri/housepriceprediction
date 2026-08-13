"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (typeof window !== 'undefined') {
            const existing = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            localStorage.setItem('contactSubmissions', JSON.stringify([{ ...formData, date: new Date().toISOString() }, ...existing]));
        }
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-primary">connect_without_contact</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-['Anton'] text-navy tracking-wide mb-4">Connect With Us</h1>
                    <p className="text-navy/50 max-w-[500px] mx-auto leading-relaxed">
                        Have questions about our AI valuation engine or need help with a transaction? We&apos;re here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 p-8 shadow-xl shadow-black/[0.02] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-xl font-bold text-navy mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            {[
                                { icon: 'mail', title: 'Email Us', desc: 'saitrishankb9@gmail.com', link: 'mailto:saitrishankb9@gmail.com' },
                                { icon: 'call', title: 'Call Us', desc: '+91 81793 69677', link: 'tel:+918179369677' },
                                { icon: 'location_on', title: 'Visit Us', desc: 'Tech Park, Bangalore, India', link: 'https://maps.google.com/?q=Tech+Park+Bangalore', target: '_blank' },
                            ].map((item, i) => (
                                <a href={item.link} target={item.target || '_self'} rel="noopener noreferrer" key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors group">
                                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <span className="material-symbols-outlined text-navy/60 group-hover:text-primary transition-colors">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-navy">{item.title}</h3>
                                        <p className="text-sm text-navy/50">{item.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/50 border border-navy/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/50 border border-navy/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-navy/60 uppercase tracking-wider mb-2">Message</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full bg-white/50 border border-navy/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-navy hover:bg-primary text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={submitted}
                            >
                                {submitted ? 'Message Sent!' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

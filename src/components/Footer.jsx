import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-cream pt-20 pb-8 overflow-hidden mt-0">
            {/* Subtle pattern background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="15" cy="15" r="1" fill="white" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                {/* Top section — Logo + tagline + CTA */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-xl">home</span>
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">HOUSE PRICE PREDICTION</span>
                        </div>
                        <p className="text-slate-blue text-sm max-w-[350px] leading-relaxed">
                            India's most accurate AI-powered platform for house price forecasting and smart property investment.
                        </p>
                    </div>
                    <Link href="/login" className="bg-primary hover:bg-red-700 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2">
                        Get Started
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/10 pt-12 mb-16">
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-5">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link href="/login" className="text-slate-blue hover:text-primary text-sm transition-colors">Marketplace</Link></li>
                            <li><Link href="/login" className="text-slate-blue hover:text-primary text-sm transition-colors">AI Predictor</Link></li>
                            <li><Link href="/login" className="text-slate-blue hover:text-primary text-sm transition-colors">Analytics</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-5">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-slate-blue hover:text-primary text-sm transition-colors">About Us</Link></li>
                            <li><Link href="/about" className="text-slate-blue hover:text-primary text-sm transition-colors">Careers</Link></li>
                            <li><Link href="/about" className="text-slate-blue hover:text-primary text-sm transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-5">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link href="/legal" className="text-slate-blue hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal" className="text-slate-blue hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal" className="text-slate-blue hover:text-primary text-sm transition-colors">RERA Compliance</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-5">Connect</h4>
                        <div className="flex gap-2 mb-4">
                            <a href="https://www.facebook.com/profile.php?id=61587374589698" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-blue hover:bg-primary hover:text-white hover:border-primary transition-all">
                                <span className="material-symbols-outlined text-base">public</span>
                            </a>
                            <a href="mailto:saitrishankb9@gmail.com" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-blue hover:bg-primary hover:text-white hover:border-primary transition-all">
                                <span className="material-symbols-outlined text-base">mail</span>
                            </a>
                        </div>
                        <p className="text-slate-blue text-xs leading-relaxed">
                            saitrishankb9@gmail.com
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-[11px] text-[#6b6560] tracking-wider">
                        © {currentYear} HomieNest. All rights reserved.
                    </p>
                    <p className="text-[11px] text-[#6b6560] tracking-wider">
                        Made with <span className="text-primary">♥</span> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}

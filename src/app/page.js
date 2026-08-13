"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from 'next/link';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { Button as NeonButton } from '@/components/ui/neon-button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { FlowButton } from '@/components/ui/flow-button';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { FadeIn, StaggerChildren, StaggerItem, CountUp, ActiveFocus, PulseGlow } from '@/components/ui/motion-wrapper';
import { MarqueeAnimation } from '@/components/ui/marquee-effect';
import { ZoomParallax } from '@/components/ui/zoom-parallax';
import { HandWrittenTitle } from '@/components/ui/hand-writing-text';
import { BlurFrame } from '@/components/ui/blur-frame';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';


// Icon Wrappers for BentoGrid (using existing Material Symbols)
const IconQueryStats = ({ className }) => <span className={`material-symbols-outlined ${className} !text-4xl`}>query_stats</span>;
const IconMap = ({ className }) => <span className={`material-symbols-outlined ${className} !text-4xl`}>map</span>;
const IconVerified = ({ className }) => <span className={`material-symbols-outlined ${className} !text-4xl`}>verified_user</span>;
const IconTrending = ({ className }) => <span className={`material-symbols-outlined ${className} !text-4xl`}>trending_up</span>;
const IconSmartToy = ({ className }) => <span className={`material-symbols-outlined ${className} !text-4xl`}>smart_toy</span>;
const IconLock = ({ className }) => <span className={`material-symbols-outlined ${className} !text-4xl`}>lock</span>;

const features = [
    {
        Icon: IconQueryStats,
        name: 'AI Price Estimator',
        description: 'Instant valuations processing millions of data points.',
        href: '/predict',
        cta: 'Try Estimator',
        imageSrc: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80', // Mumbai Skyline (Real)
        className: 'lg:col-span-1 lg:row-span-1',
    },
    {
        Icon: IconMap,
        name: 'Investment Heatmaps',
        description: 'Spot growth corridors before the market does.',
        href: '/analytics',
        cta: 'View Maps',
        imageSrc: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80', // Bangalore Tech Park (Real)
        className: 'lg:col-span-2 lg:row-span-1',
    },
    {
        Icon: IconVerified,
        name: 'Legal Verification',
        description: 'RERA verified data for risk-free investments.',
        href: '/legal',
        cta: 'Learn More',
        imageSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Modern High Rise (Real)
        className: 'lg:col-span-2 lg:row-span-1',
    },
    {
        Icon: IconTrending,
        name: 'Market Trends',
        description: 'Real-time city analytics and neighborhood scoring.',
        href: '/analytics',
        cta: 'Check Trends',
        imageSrc: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', // Delhi Wide Road (Real)
        className: 'lg:col-span-1 lg:row-span-1',
    },
    {
        Icon: IconSmartToy,
        name: 'Smart Predictions',
        description: 'Future value forecasting powered by Deep Learning.',
        href: '/predict',
        cta: 'Forecast Now',
        imageSrc: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', // High-tech abstract/AI/Future
        className: 'lg:col-span-1 lg:row-span-1',
    },
    {
        Icon: IconLock,
        name: 'Secure Insights',
        description: 'Enterprise grade security for your investment data.',
        href: '/legal',
        cta: 'Read Policy',
        imageSrc: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', // Digital Security/Lock/Data
        className: 'lg:col-span-2 lg:row-span-1',
    },
];

export default function Home() {
    return (
        <div className="relative text-white selection:bg-primary/30">

            {/* ====== HERO — BACKGROUND PATHS ====== */}
            <BackgroundPaths title="Your Smarter Home Advisor" />

            {/* ====== MARQUEE ====== */}
            <div className="py-4 bg-black/40 border-y border-white/5 backdrop-blur-sm z-20 relative overflow-hidden">
                <MarqueeAnimation baseVelocity={-2} className="text-white/20 text-4xl font-black py-2">
                    AI ANALYTICS • SMART FORECASTING • INVESTMENT INSIGHTS • REAL-TIME DATA •
                </MarqueeAnimation>
            </div>

            {/* ====== STATS BAR ====== */}
            <ActiveFocus>
                <section className="py-20 px-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
                    <StaggerChildren className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center" stagger={0.15}>
                        <StaggerItem>
                            <p className="text-5xl md:text-6xl font-extralight text-white"><CountUp target={98} /></p>
                            <p className="text-[10px] text-primary mt-3 uppercase tracking-[0.2em] font-bold">Accuracy %</p>
                        </StaggerItem>
                        <StaggerItem>
                            <p className="text-5xl md:text-6xl font-extralight text-white/80"><CountUp target={150} /></p>
                            <p className="text-[10px] text-primary mt-3 uppercase tracking-[0.2em] font-bold">Cities Covered</p>
                        </StaggerItem>
                        <StaggerItem>
                            <p className="text-5xl md:text-6xl font-extralight text-white/60"><CountUp target="1" suffix="k+" /></p>
                            <p className="text-[10px] text-primary mt-3 uppercase tracking-[0.2em] font-bold">Active Users</p>
                        </StaggerItem>
                        <StaggerItem>
                            <p className="text-5xl md:text-6xl font-extralight text-white/40"><CountUp target="50" suffix="k+" /></p>
                            <p className="text-[10px] text-primary mt-3 uppercase tracking-[0.2em] font-bold">Predictions</p>
                        </StaggerItem>
                    </StaggerChildren>
                </section>
            </ActiveFocus>

            {/* ── gradient divider ── */}
            <div className="h-24 bg-gradient-to-b from-transparent to-black/20" aria-hidden="true" />

            {/* ====== ABOUT SECTION ====== */}
            <ActiveFocus>
                <section className="py-32 px-6 md:px-16 lg:px-24">
                    <div className="max-w-6xl mx-auto">
                        <FadeIn delay={0.2} className="flex flex-col md:flex-row gap-20 items-center">
                            <div className="md:w-1/2">
                                <BlurFrame>
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 pl-1">About HomieNest</span>
                                    <h2 className="text-4xl md:text-6xl font-light text-white leading-[1.1] tracking-tight mb-8">
                                        Decoding <span className="text-white/50">Real Estate</span> Chaos Into <span className="text-primary">Clarity</span>.
                                    </h2>
                                    <p className="text-white/60 text-lg leading-relaxed mb-8 font-light">
                                        HomieNest combines deep learning with localized real estate data to give you the upper hand. Whether you&apos;re a first-time buyer or seasoned investor — our AI does the heavy lifting.
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-white/80">
                                        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Unbiased Data</span>
                                        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 98% Accuracy</span>
                                    </div>
                                </BlurFrame>
                            </div>
                            <div className="md:w-1/2">
                                <BlurFrame className="p-2">
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5 group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="Analysis" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 text-white">
                                            <p className="text-[10px] uppercase tracking-widest text-primary mb-1">Live Feed</p>
                                            <p className="text-xl font-light">Market Pulse Analysis</p>
                                        </div>
                                    </div>
                                </BlurFrame>
                            </div>
                        </FadeIn>
                    </div>
                </section>
            </ActiveFocus>

            {/* ── gradient divider ── */}
            <div className="h-24 bg-gradient-to-b from-transparent to-black/20" aria-hidden="true" />

            {/* ====== HOW IT WORKS ====== */}
            <ActiveFocus>
                <section className="py-32 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-transparent to-black/40">
                    <div className="max-w-6xl mx-auto">
                        <HandWrittenTitle title="How It Works" subtitle="Three simple steps to smarter property decisions." />

                        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.15}>
                            {[
                                { num: '01', title: 'Enter Location', desc: 'Type any city or micro-market.' },
                                { num: '02', title: 'AI Analysis', desc: 'Processing millions of data points.' },
                                { num: '03', title: 'Get Forecast', desc: 'Accurate predictions & scoring.' },
                            ].map((step, i) => (
                                <StaggerItem key={i} className="h-full">
                                    <BlurFrame className="h-full hover:-translate-y-2 transition-transform duration-500">
                                        <div className="text-4xl font-light text-white/20 mb-6 font-['Anton'] opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">{step.num}</div>
                                        <h3 className="text-xl font-normal text-white mb-3">{step.title}</h3>
                                        <p className="text-white/50 text-sm font-light leading-relaxed">{step.desc}</p>
                                    </BlurFrame>
                                </StaggerItem>
                            ))}
                        </StaggerChildren>
                    </div>
                </section>
            </ActiveFocus>

            {/* ── gradient divider ── */}
            <div className="h-24 bg-gradient-to-b from-black/20 to-transparent" aria-hidden="true" />

            {/* ====== BENTO GRID FEATURES ====== */}
            <ActiveFocus>
                <section className="py-32 px-6 md:px-16 lg:px-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col gap-12">
                            <FadeIn delay={0.2}>
                                <motion.div

                                    className="bg-[#0a0a0a] p-6 md:p-10 rounded-2xl border border-white/10 mb-12 [box-shadow:0_0_0_1px_rgba(255,255,255,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                                    <div className="relative z-10">
                                        <h2 className="text-4xl md:text-5xl font-light text-white leading-[1.1] mb-4 tracking-tight">
                                            Built for <span className="text-primary font-normal">serious</span> decisions.
                                        </h2>
                                        <p className="text-white/80 text-base md:text-lg leading-relaxed font-light max-w-2xl">
                                            Every feature gives you an unfair advantage in competitive markets.
                                        </p>
                                    </div>
                                </motion.div>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <BentoGrid>
                                    {features.map((feature) => (
                                        <BentoCard key={feature.name} {...feature} />
                                    ))}
                                </BentoGrid>
                            </FadeIn>
                        </div>
                    </div>
                </section >
            </ActiveFocus>

            {/* ====== ZOOM PARALLAX ====== */}
            < section className="relative" >
                <div className="relative flex flex-col h-[50vh] items-center justify-center">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_50%)] blur-[30px]"
                    />
                    <h2 className="text-center text-4xl md:text-5xl font-light text-white mb-6">
                        Discover Your <span className="text-primary font-normal">Dream Home</span>
                    </h2>
                    <p className="text-center text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto mb-8">
                        Experience the future of real estate with our immersive property showcase, featuring exclusive listings from top developers.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/listings">
                            <ShinyButton className="font-bold uppercase tracking-widest text-xs">
                                <span className="relative z-10">View Marketplace</span>
                            </ShinyButton>
                        </Link>
                    </div>
                </div>

                <ZoomParallax images={[
                    { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Modern glass skyscraper' },
                    { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Luxury living room interior' },
                    { src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Modern dream home' },
                    { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Elegant apartment interior' },
                    { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Contemporary villa with pool' },
                    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Modern home entrance' },
                    { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&auto=format&q=80', alt: 'Urban cityscape' },
                ]} />
            </section >

            {/* ── gradient divider ── */}
            <div className="h-24 bg-gradient-to-b from-transparent to-black/20" aria-hidden="true" />

            {/* ====== LISTINGS SHOWCASE ====== */}
            <ActiveFocus>
                <section id="listings" className="py-32 px-6 md:px-16 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-4">
                                    Premium <span className="text-primary font-normal">Listings</span>
                                </h2>
                                <p className="text-white/50 text-lg md:text-xl font-light max-w-2xl mx-auto">
                                    Handpicked properties across India&apos;s most sought-after locations, verified and scored by our AI engine.
                                </p>
                            </div>
                        </FadeIn>

                        {/* Stats bar */}
                        <FadeIn delay={0.15}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                                {[
                                    { label: 'Listed Properties', value: '2400', suffix: '+' },
                                    { label: 'Cities Covered', value: '85', suffix: '' },
                                    { label: 'Avg. AI Score', value: '94.2', suffix: '%' },
                                    { label: 'Happy Buyers', value: '12', suffix: 'K+' },
                                ].map((stat, i) => (
                                    <StaggerItem key={i}>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                                            <p className="text-2xl md:text-3xl font-bold text-white mb-1"><CountUp target={stat.value} suffix={stat.suffix} /></p>
                                            <p className="text-white/40 text-sm">{stat.label}</p>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </div>
                        </FadeIn>

                        {/* Property Grid */}
                        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" stagger={0.08}>
                            {[
                                { name: 'The Glass Penthouse', location: 'South Mumbai, Maharashtra', price: '₹18.5 Cr', beds: 4, baths: 5, sqft: '5,200', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format&q=80', tag: 'Luxury', tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                                { name: 'Riverside Villa', location: 'Whitefield, Bengaluru', price: '₹7.2 Cr', beds: 5, baths: 4, sqft: '4,800', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format&q=80', tag: 'Featured', tagColor: 'bg-primary/20 text-primary border-primary/30' },
                                { name: 'Sky Loft Apartment', location: 'Bandra West, Mumbai', price: '₹12.8 Cr', beds: 3, baths: 3, sqft: '3,500', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format&q=80', tag: 'New Launch', tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                                { name: 'Garden Estate', location: 'Golf Course Road, Gurugram', price: '₹9.5 Cr', beds: 6, baths: 5, sqft: '6,100', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&auto=format&q=80', tag: 'Premium', tagColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
                                { name: 'Urban Studio', location: 'Koramangala, Bengaluru', price: '₹1.8 Cr', beds: 2, baths: 2, sqft: '1,200', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format&q=80', tag: 'Investment', tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
                                { name: 'Coastal Retreat', location: 'ECR, Chennai', price: '₹5.4 Cr', beds: 4, baths: 3, sqft: '3,800', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format&q=80', tag: 'Trending', tagColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
                            ].map((property, index) => (
                                <StaggerItem key={index}>
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl cursor-pointer"
                                    >
                                        <div className="relative h-56 overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={property.image} alt={property.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${property.tagColor}`}>{property.tag}</span>
                                            <div className="absolute bottom-4 left-4">
                                                <p className="text-2xl font-bold text-white tracking-tight">{property.price}</p>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">{property.name}</h3>
                                            <p className="text-white/50 text-sm mb-4">{property.location}</p>
                                            <div className="flex items-center gap-4 text-white/40 text-sm">
                                                <span>{property.beds} Beds</span>
                                                <span>{property.baths} Baths</span>
                                                <span>{property.sqft} sqft</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ring-1 ring-primary/30" />
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </StaggerChildren>

                        {/* View All CTA */}
                        <FadeIn delay={0.5}>
                            <div className="flex justify-center">
                                <Link href="/listings">
                                    <ShinyButton className="font-bold uppercase tracking-widest text-xs">
                                        View All Listings
                                    </ShinyButton>
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </section>
            </ActiveFocus>

            {/* ── gradient divider ── */}
            <div className="h-24 bg-gradient-to-b from-transparent to-black/20" aria-hidden="true" />

            {/* ── gradient divider ── */}
            <div className="h-24 bg-gradient-to-b from-transparent to-black/20" aria-hidden="true" />

            {/* ====== TYPEWRITER SECTION ====== */}
            <div className="flex flex-col items-center justify-center py-20 bg-black/40 backdrop-blur-sm border-y border-white/5">
                <p className="text-white/80 text-xs sm:text-base mb-4">
                    The future of property valuation is here
                </p>
                <TypewriterEffectSmooth words={[
                    { text: "Unlock", className: "text-white" },
                    { text: "Real", className: "text-white" },
                    { text: "Estate", className: "text-white" },
                    { text: "Insights", className: "text-white" },
                    { text: "Instantly.", className: "text-primary dark:text-primary" },
                ]} />
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-6">
                    <Link href="/signup">
                        <button className="w-40 h-10 rounded-xl bg-primary text-white text-sm font-bold shadow-lg hover:bg-primary/80 transition-colors">
                            Join Now
                        </button>
                    </Link>
                    <Link href="/about">
                        <button className="w-40 h-10 rounded-xl bg-white/5 text-white border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors">
                            Learn More
                        </button>
                    </Link>
                </div>
            </div>

            {/* ── gradient divider ── */}
            <div className="h-24 bg-gradient-to-b from-black/20 to-transparent" aria-hidden="true" />

            {/* ====== CTA BOTTOM ====== */}
            <section className="py-32 px-6 text-center">
                <FadeIn className="max-w-3xl mx-auto border border-white/10 rounded-[3rem] p-12 md:p-20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm relative overflow-hidden cta-shine">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                    <h2 className="text-4xl md:text-6xl font-light text-white mb-8">Ready to <span className="text-primary">Predict?</span></h2>
                    <PulseGlow className="inline-block rounded-full">
                        <Link href="/predict">
                            <FlowButton
                                text="Start Analysis"
                                className="font-bold uppercase tracking-widest text-xs border-primary/40 text-primary hover:bg-primary hover:text-white hover:border-primary"
                                circleClassName="bg-primary"
                            />
                        </Link>
                    </PulseGlow>
                </FadeIn>
            </section >

        </div >
    );
}

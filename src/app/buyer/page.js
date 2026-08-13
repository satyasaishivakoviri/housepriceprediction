"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { TabBar, StatCard, SectionHeader, EmptyState, ProgressRing } from '@/components/ui/RoleTheme';
import { properties, cityData, neighborhoodScores, formatPrice, formatNumber, predictPrice, monthlyTrends, savedSearches, tourRequests, buyerOffers, activityTimeline, notifications, getMonthlyEstimate, getPriceHistory, getTaxHistory, getSchoolsNearby, getRecommendations, buyerPipelineStages, buyerPipelineLabels, buyerPipelineColors } from '@/lib/mockData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

const ACCENT = '#c93a2a';

// ==================== PROPERTY CARD ====================
function PropertyCard({ property, onSave, saved, onSelect, compact }) {
    const tempColors = { hot: '#ef4444', warm: '#f59e0b', neutral: '#6b7280', cold: '#3b82f6' };
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer" onClick={() => onSelect?.(property)}>
            <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={property.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white ${property.status === 'active' ? 'bg-green-500' : property.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'}`}>{property.status}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-600/90 text-white flex items-center gap-0.5 shadow-lg shadow-red-500/20 ring-1 ring-white/20">
                        <span className="material-symbols-outlined text-[10px]">auto_awesome</span> AI Valued
                    </span>
                    {property.trending && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-500 text-white">🔥 Hot</span>}
                    {property.priceDropped && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500 text-white">↓ Price Drop</span>}
                    {property.newListing && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-purple-500 text-white">✨ New</span>}
                </div>
                <button onClick={e => { e.stopPropagation(); onSave?.(property.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all">
                    <span className="material-symbols-outlined text-base" style={{ color: saved ? ACCENT : '#999', fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </button>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold text-white" style={{ background: tempColors[property.marketTemp] || '#6b7280' }}>
                    <span className="material-symbols-outlined text-xs">thermostat</span>{property.marketTemp}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-red-600 transition-colors">{property.name}</h3>
                <p className="text-[11px] text-white/60 flex items-center gap-1 mb-2"><span className="material-symbols-outlined text-xs">location_on</span>{property.locality}, {property.city}</p>
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <div className="text-lg font-['Anton'] text-white tracking-wide">{formatPrice(property.price)}</div>
                        <div className="text-[10px] text-white/40">₹{property.pricePerSqft.toLocaleString()}/sqft</div>
                    </div>
                    <div className="flex gap-2 text-[10px] text-white/60 font-medium">
                        <span>{property.bedrooms} BHK</span><span>{property.sqft} sqft</span>
                    </div>
                </div>
                {!compact && <div className="flex items-center gap-3 text-[9px] text-white/40 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">shield</span>{property.safetyScore}</span>
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">directions_transit</span>{property.commuteScore}</span>
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">trending_up</span>{property.resalePotential}%</span>
                    <span className="ml-auto">{property.daysListed}d listed</span>
                </div>}
            </div>
        </div>
    );
}

// ==================== 1. DISCOVERY TAB ====================
function DiscoveryTab({ savedIds, onSave, onSelect }) {
    const searchParams = useSearchParams(); // Added hook
    const [filters, setFilters] = useState({ city: '', type: '', bedrooms: '', minPrice: '', maxPrice: '', safetyMin: '', commuteMin: '', onlyOpenHouse: false, onlyPriceDrop: false, onlyNew: false });
    const [sortBy, setSortBy] = useState('newest');
    const [props, setProps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let userProps = [];
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('userProperties');
            if (saved) {
                try {
                    userProps = JSON.parse(saved).map(p => ({
                        ...p,
                        marketTemp: p.marketTemp || 'hot',
                        safetyScore: p.safetyScore || 85,
                        commuteScore: p.commuteScore || 80,
                        resalePotential: p.resalePotential || 12,
                        daysListed: p.daysListed || 1,
                        pricePerSqft: p.pricePerSqft || Math.round(p.price / (p.sqft || 1)),
                        type: p.type || 'Apartment',
                        status: p.status || 'active',
                        trending: true,
                        newListing: true
                    }));
                } catch (e) { }
            }
        }

        fetch('/api/properties')
            .then(res => res.json())
            .then(data => {
                setProps([...userProps, ...data]);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch properties:", err);
                setProps([...userProps, ...properties]); // Fallback to mock + user props
                setLoading(false);
            });
    }, []);

    // Sync with URL params
    useEffect(() => {
        const cityParam = searchParams.get('city');
        setFilters(prev => ({ ...prev, city: cityParam || '' }));
    }, [searchParams]);

    const cities = useMemo(() => [...new Set(props.map(p => p.city))].sort(), [props]);
    const types = useMemo(() => [...new Set(properties.map(p => p.type))].sort(), []);

    const filtered = useMemo(() => {
        let result = props.filter(p => {
            if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
            if (filters.type && p.type !== filters.type) return false;
            if (filters.bedrooms && p.bedrooms !== parseInt(filters.bedrooms)) return false;
            if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
            if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
            if (filters.safetyMin && p.safetyScore < parseInt(filters.safetyMin)) return false;
            if (filters.commuteMin && p.commuteScore < parseInt(filters.commuteMin)) return false;
            if (filters.onlyOpenHouse && !p.openHouseDate) return false;
            if (filters.onlyPriceDrop && !p.priceDropped) return false;
            if (filters.onlyNew && !p.newListing) return false;
            return true;
        });

        // Sorting Logic
        return result.sort((a, b) => {
            if (sortBy === 'price_low') return a.price - b.price;
            if (sortBy === 'price_high') return b.price - a.price;
            if (sortBy === 'sqft_high') return b.sqft - a.sqft;
            if (sortBy === 'newest') return (a.daysListed || 0) - (b.daysListed || 0);
            if (sortBy === 'trending') return (b.saves || 0) - (a.saves || 0);
            return 0;
        });
    }, [props, filters, sortBy]);
    const clear = () => setFilters({ city: '', type: '', bedrooms: '', minPrice: '', maxPrice: '', safetyMin: '', commuteMin: '', onlyOpenHouse: false, onlyPriceDrop: false, onlyNew: false });
    const S = "bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-white/70 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10";
    return (
        <div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                    <select value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} className={S + " min-w-[130px]"}><option value="">All Cities</option>{cities.map(c => <option key={c}>{c}</option>)}</select>
                    <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} className={S + " min-w-[120px]"}><option value="">All Types</option>{types.map(t => <option key={t}>{t}</option>)}</select>
                    <select value={filters.bedrooms} onChange={e => setFilters(f => ({ ...f, bedrooms: e.target.value }))} className={S + " min-w-[110px]"}><option value="">Bedrooms</option>{[1, 2, 3, 4].map(b => <option key={b} value={b}>{b} BHK</option>)}</select>
                    <select value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} className={S + " min-w-[120px]"}><option value="">Min Price</option>{[5000000, 10000000, 30000000, 50000000, 100000000].map(p => <option key={p} value={p}>{formatPrice(p)}</option>)}</select>
                    <select value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} className={S + " min-w-[120px]"}><option value="">Max Price</option>{[10000000, 30000000, 50000000, 100000000, 500000000].map(p => <option key={p} value={p}>{formatPrice(p)}</option>)}</select>
                    <select value={filters.safetyMin} onChange={e => setFilters(f => ({ ...f, safetyMin: e.target.value }))} className={S + " min-w-[120px]"}><option value="">Safety Score</option>{[60, 70, 80, 90].map(s => <option key={s} value={s}>≥ {s}</option>)}</select>
                    <select value={filters.commuteMin} onChange={e => setFilters(f => ({ ...f, commuteMin: e.target.value }))} className={S + " min-w-[130px]"}><option value="">Commute Score</option>{[60, 70, 80, 90].map(s => <option key={s} value={s}>≥ {s}</option>)}</select>

                    <div className="h-8 w-px bg-white/10 mx-2 self-center hidden lg:block" />

                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Sort By:</span>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={S + " min-w-[140px] border-red-500/30 text-red-100"}>
                            <option value="newest">Newest First</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="sqft_high">Largest Area</option>
                            <option value="trending">Most Popular</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    {[['onlyOpenHouse', 'Open Houses'], ['onlyPriceDrop', 'Price Drops'], ['onlyNew', 'New Listings']].map(([k, l]) => (
                        <label key={k} className="flex items-center gap-1.5 text-xs font-bold text-white/50 cursor-pointer hover:text-white/80 transition-colors">
                            <input type="checkbox" checked={filters[k]} onChange={e => setFilters(f => ({ ...f, [k]: e.target.checked }))} className="rounded accent-red-600" />{l}
                        </label>
                    ))}
                    <div className="ml-auto flex items-center gap-2">
                        <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-bold text-red-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">auto_awesome</span> AI POWERED DATA
                        </span>
                        {Object.values(filters).some(Boolean) && <button onClick={clear} className="px-3 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-500/10 rounded-lg uppercase tracking-wider transition-colors">Clear All</button>}
                    </div>
                </div>
                <div className="mt-3 text-[11px] text-white/40 font-bold uppercase tracking-wider">
                    {loading ? "Analyzing market history..." : `${filtered.length} properties optimized by AI Prediction engine`}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/3] bg-white/5 animate-pulse rounded-2xl" />) :
                    filtered.map(p => <PropertyCard key={p.id} property={p} saved={savedIds.has(p.id)} onSave={onSave} onSelect={onSelect} />)}
            </div>
            {filtered.length === 0 && <EmptyState icon="search_off" title="No properties match your filters" subtitle="Try adjusting your search criteria" />}
        </div>
    );
}

// ==================== 2. PROPERTY DETAIL TAB ====================
function PropertyDetailTab({ selectedProperty, savedIds, onSave, handleTourRequest, handleMakeOffer }) {
    if (!selectedProperty) return <EmptyState icon="home" title="Select a property to view details" subtitle="Click any property card from Discovery tab" />;
    const p = selectedProperty;
    const priceHist = getPriceHistory(p.id);
    const taxHist = getTaxHistory(p.id);
    const schools = getSchoolsNearby(p.locality);
    const monthly = getMonthlyEstimate(p.price);
    const similar = properties.filter(x => x.id !== p.id && x.city === p.city && x.type === p.type && x.status === 'active').slice(0, 3);
    return (
        <div className="space-y-6">
            {/* Property header */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-3xl">{p.image}</span>
                            <div>
                                <h2 className="text-xl font-bold text-white">{p.name}</h2>
                                <p className="text-xs text-white/60">{p.locality}, {p.city}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xs text-white/50 mt-2">
                            <span>{p.bedrooms} BHK</span><span>{p.sqft} sqft</span><span>Floor {p.floor}/{p.totalFloors}</span><span>{p.age} yrs old</span><span>{p.daysListed} days listed</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-['Anton'] text-white">{formatPrice(p.price)}</div>
                        <div className="text-xs text-white/40">₹{p.pricePerSqft.toLocaleString()}/sqft</div>
                        <button onClick={() => onSave?.(p.id)} className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95" style={{ background: savedIds.has(p.id) ? ACCENT : 'rgba(255,255,255,0.1)', border: `1px solid ${savedIds.has(p.id) ? 'transparent' : 'rgba(255,255,255,0.2)'}` }}>
                            {savedIds.has(p.id) ? '♥ Saved' : '♡ Save'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['thermostat', 'Market Temp', p.marketTemp?.toUpperCase(), { hot: '#ef4444', warm: '#f59e0b', neutral: '#6b7280', cold: '#3b82f6' }[p.marketTemp]], ['shield', 'Safety Score', `${p.safetyScore}/100`, '#22c55e'], ['directions_transit', 'Commute Score', `${p.commuteScore}/100`, '#3b82f6'], ['trending_up', 'Resale Potential', `${p.resalePotential}%`, '#8b5cf6']].map(([i, l, v, c]) => (
                    <div key={l} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <span className="material-symbols-outlined text-lg" style={{ color: c }}>{i}</span>
                        <div className="text-sm font-bold text-white mt-1">{v}</div>
                        <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider">{l}</div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Price History */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-red-500">timeline</span>Price History</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={priceHist}><defs><linearGradient id="ph" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={ACCENT} stopOpacity={0.15} /><stop offset="95%" stopColor={ACCENT} stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} /><YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={v => formatPrice(v)} />
                            <Tooltip formatter={v => formatPrice(v)} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 11, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }} /><Area type="monotone" dataKey="price" stroke={ACCENT} fill="url(#ph)" strokeWidth={2} /></AreaChart>
                    </ResponsiveContainer>
                </div>
                {/* Monthly Cost */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-green-500">calculate</span>Est. Monthly Cost</h3>
                    <div className="space-y-3">
                        {[['EMI (20yr @ 8.5%)', monthly.emi], ['Property Tax', monthly.tax], ['Insurance', monthly.insurance], ['HOA/Maintenance', monthly.hoa]].map(([l, v]) => (
                            <div key={l} className="flex justify-between text-xs"><span className="text-white/60">{l}</span><span className="font-bold text-white">{formatPrice(v)}</span></div>
                        ))}
                        <div className="flex justify-between text-sm font-bold pt-3 border-t border-white/10"><span className="text-white/60">Total Monthly</span><span className="text-red-500">{formatPrice(monthly.total)}</span></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                        <div className="bg-white/5 rounded-xl p-3"><div className="text-sm font-bold text-white">{formatPrice(monthly.downPayment)}</div><div className="text-[9px] text-white/40 font-bold uppercase">Down Payment (20%)</div></div>
                        <div className="bg-white/5 rounded-xl p-3"><div className="text-sm font-bold text-white">{formatPrice(p.rentEstimate)}/mo</div><div className="text-[9px] text-white/40 font-bold uppercase">Rent Estimate</div></div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tax History */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-amber-500">receipt_long</span>Tax History</h3>
                    <table className="w-full text-xs">
                        <thead><tr className="bg-white/5"><th className="px-3 py-2 text-left text-white/40 font-bold uppercase tracking-wider">Year</th><th className="px-3 py-2 text-right text-white/40 font-bold uppercase tracking-wider">Annual Tax</th><th className="px-3 py-2 text-right text-white/40 font-bold uppercase tracking-wider">Assessed Value</th></tr></thead>
                        <tbody>{taxHist.map(t => <tr key={t.year} className="border-t border-white/10"><td className="px-3 py-2 font-medium text-white">{t.year}</td><td className="px-3 py-2 text-right text-white/60">{formatPrice(t.tax)}</td><td className="px-3 py-2 text-right text-white/60">{formatPrice(t.assessed)}</td></tr>)}</tbody>
                    </table>
                    <div className="mt-3 p-3 bg-amber-900/20 rounded-xl text-[10px] text-amber-400 font-bold uppercase tracking-wider">HOA/Maintenance: {formatPrice(p.hoaMonthly)}/month</div>
                </div>
                {/* Schools */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">school</span>Nearby Schools</h3>
                    <div className="space-y-3">{schools.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div><div className="text-xs font-bold text-white">{s.name}</div><div className="text-[10px] text-white/40">{s.type} • {s.distance}</div></div>
                            <div className="flex items-center gap-1"><span className="text-amber-500 text-xs">★</span><span className="text-xs font-bold text-white">{s.rating}</span></div>
                        </div>
                    ))}</div>
                </div>
            </div>
            {/* Actions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-wrap gap-4 items-center justify-between">
                <div>
                    <h3 className="font-bold text-white text-sm mb-1">Interested in this property?</h3>
                    <p className="text-xs text-white/40 font-medium">Connect with an agent to proceed with viewing or purchase.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleTourRequest(p)}
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm text-amber-500">event</span> Schedule Tour
                    </button>
                    <button
                        onClick={() => handleMakeOffer(p)}
                        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">gavel</span> Make Official Offer
                    </button>
                </div>
            </div>

            {/* Similar Properties */}
            {similar.length > 0 && <div>
                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-purple-500">compare_arrows</span>Similar Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{similar.map(s => <PropertyCard key={s.id} property={s} saved={savedIds.has(s.id)} onSave={onSave} compact />)}</div>
            </div>}
        </div>
    );
}

// ==================== 3. AI PREDICTOR ====================
// Default form values (used for initialization)
const PREDICTOR_DEFAULTS = {
    city: 'Mumbai',
    locality: '',
    sqft: 1000,
    bedrooms: 2,
    floor: 5,
    age: 2,
    propertyType: 'Apartment',
    furnishing: 'Semi-Furnished',
    constructionStatus: 'Ready to Move',
    facing: 'East',
    // Property Structure
    bathrooms: 2,
    balconies: 1,
    totalFloors: 10,
    unitPosition: 'Middle',
    parking: 'Open',
    servantRoom: 'No',
    studyRoom: 'No',
    // Direction & View
    mainDoorFacing: 'East',
    balconyFacing: 'North',
    parkFacing: 'No',
    gardenView: 'No',
    seaLakeView: 'No',
    roadView: 'No',
    // Amenities
    amenities: ['Security', 'Lift', 'Power backup'],
    // Building & Legal
    builderReputation: 'Standard',
    reraApproved: 'Yes',
    occupancyCertificate: 'Yes',
    gatedCommunity: 'Yes',
    // Investment Intent
    intent: 'Self Use',
    // Connectivity
    distanceMetro: 2,
    highwayAccess: 5,
    airportDistance: 15,
    businessHubDistance: 10
};

function PredictorTab({ form, setForm, result, setResult, hasPredicted, setHasPredicted, generatedImage, setGeneratedImage }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openSection, setOpenSection] = useState(null); // 'structure', 'view', 'amenities', 'legal', 'intent'
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [loanParams, setLoanParams] = useState({ down: 20, tenure: 20, rate: 8.75 });

    // AI Image Generation State
    const [generatingImage, setGeneratingImage] = useState(false);

    const validateForm = (f) => {
        if (f.sqft < 50) return "Area cannot be less than 50 sq.ft.";
        if (f.sqft > 50000) return "Area is too large for standard residential property.";
        if (f.totalFloors > 163) return "Total floors cannot exceed 163 (Burj Khalifa limit).";
        if (f.floor > f.totalFloors && f.propertyType !== 'Plot') return "Floor cannot be greater than Total Floors.";
        if (f.bathrooms > f.bedrooms + 3) return "Too many bathrooms for the given number of bedrooms.";
        if (f.balconies > f.bedrooms + 3) return "Too many balconies for the given property size.";
        if (f.age > 150) return "Property age seems unrealistically high.";
        if ((f.propertyType === 'Villa' || f.propertyType === 'Independent House') && f.totalFloors > 10) return "Villas/Independent houses typically don't have that many floors.";
        if ((f.propertyType === 'Villa' || f.propertyType === 'Independent House') && f.floor > 10) return "Floor number too high for a Villa/Independent house.";
        if (f.floor < -5) return "Floor cannot be lower than -5.";
        if (f.bedrooms < 1 && f.propertyType !== 'Plot') return "Bedrooms must be at least 1.";
        return null;
    };

    const getPropertyImage = (form) => {
        const { propertyType, bedrooms, amenities } = form;
        const hasPool = amenities.includes('Swimming pool');

        // 1. VILLAS & INDEPENDENT HOUSES
        if (propertyType === 'Villa' || propertyType === 'Independent House') {
            if (hasPool) return 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop'; // Modern Villa with Pool
            if (bedrooms > 4) return 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000&auto=format&fit=crop'; // Luxury Estate
            return 'https://images.unsplash.com/photo-1605276374104-d24d20672124?q=80&w=1000&auto=format&fit=crop'; // Standard Modern House
        }

        // 2. APARTMENTS
        if (propertyType === 'Apartment') {
            if (bedrooms > 3) return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop'; // Luxury Penthouse/Interiors
            return 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop'; // Modern Apartment
        }

        // 3. PLOTS
        if (propertyType === 'Plot') {
            return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'; // Land/Plot
        }

        // Fallback
        return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop';
    };

    const handlePredict = () => {
        const err = validateForm(form);
        if (err) {
            setError(err);
            setResult(null);
            return;
        }
        setError(null);
        setHasPredicted(true);
        setLoading(true);
        setGeneratingImage(true);
        // Do NOT clear result here to keep UI stable or to allow "Generating" state to render in place

        // Simulate AI Processing & Image Generation
        setTimeout(() => {
            try {
                const predicted = predictPrice(form);
                const image = getPropertyImage(form);

                setGeneratedImage(image);
                setResult(predicted); // Result updates AFTER generation
            } catch (err) {
                console.error("Prediction Error:", err);
            } finally {
                setLoading(false);
                setGeneratingImage(false);
            }
        }, 1500); // 1.5s delay for "wow" factor
    };

    // AUTO-RECALCULATE: Whenever form changes and a prediction already exists, instantly update the result
    useEffect(() => {
        if (!hasPredicted) return;

        const err = validateForm(form);
        if (err) {
            setError(err);
            setResult(null);
            return;
        }
        setError(null);

        try {
            const predicted = predictPrice(form);
            const image = getPropertyImage(form);
            setGeneratedImage(image);
            setResult(predicted);
        } catch (err) {
            console.error("Live Prediction Error:", err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, hasPredicted]);

    const trendData = monthlyTrends.map(m => ({ ...m, avgPrice: m.avgPrice / 100000 }));
    const F = "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10";
    const L = "text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mb-1.5 block";
    const B_TERTIARY = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all";

    // Mock data for new sections
    const factors = [
        { label: 'Location Premium', value: 82, trend: '+12%', icon: 'location_on' },
        { label: 'Market Demand', value: 94, trend: 'High', icon: 'trending_up' },
        { label: 'Floor Utility', value: 45, trend: '+3%', icon: 'layers' },
        { label: 'Amenities Value', value: 76, trend: 'Premium', icon: 'verified' },
        { label: 'Age Factor', value: 15, trend: '-2%', icon: 'history' },
        { label: 'Momentum', value: 88, trend: 'Bullish', icon: 'speed' },
    ];

    const localityStats = [
        { label: 'Safety Score', value: 92, icon: 'shield_check', color: '#22c55e' },
        { label: 'Transport Connectivity', value: 85, icon: 'train', color: '#3b82f6' },
        { label: 'Medical Facilities', value: 78, icon: 'medical_services', color: '#ef4444' },
        { label: 'Educational Hubs', value: 88, icon: 'school', color: '#f59e0b' },
        { label: 'Lifestyle & Dining', value: 95, icon: 'restaurant', color: '#8b5cf6' },
        { label: 'Future Infrastructure', value: 74, icon: 'construction', color: '#ec4899' },
    ];

    const emiData = result ? getMonthlyEstimate(result.predicted) : null;

    return (
        <div className="space-y-14 pb-12">
            {/* TOP ROW: INPUT + RESULT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-fit">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">smart_toy</span>
                        AI Price Prediction
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className={L}>City</label>
                            <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={F}>
                                {cityData.sort((a, b) => a.city.localeCompare(b.city)).map(c => <option key={c.city}>{c.city}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={L}>Locality / Street Name</label>
                            <input
                                type="text"
                                value={form.locality}
                                onChange={e => setForm(f => ({ ...f, locality: e.target.value }))}
                                placeholder="e.g. Bandra West, MG Road"
                                className={F}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className={L}>Area (sqft)</label><input type="number" value={form.sqft} onChange={e => setForm(f => ({ ...f, sqft: +e.target.value }))} className={F} /></div>
                            <div>
                                <label className={L}>Bedrooms</label>
                                <select value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: +e.target.value }))} className={F}>
                                    {[1, 2, 3, 4, 5].map(b => <option key={b} value={b}>{b} BHK</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className={L}>Floor</label><input type="number" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: +e.target.value }))} className={F} /></div>
                            <div><label className={L}>Age (yrs)</label><input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} className={F} /></div>
                        </div>

                        {/* MORE OPTIONS TOGGLE */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between py-2 px-1 text-[10px] font-bold text-white/30 hover:text-white/60 uppercase tracking-[0.2em] transition-all group"
                        >
                            <span className="flex items-center gap-2">
                                <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}>expand_more</span>
                                {showAdvanced ? 'Less Options' : 'More Options'}
                            </span>
                            <div className="h-px flex-1 mx-4 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
                        </button>

                        {/* ADVANCED EXPANDABLE SECTIONS */}
                        <div className={`space-y-2 overflow-hidden transition-all duration-500 ease-in-out ${showAdvanced ? 'max-h-[2000px] opacity-100 pt-2' : 'max-h-0 opacity-0 pt-0'}`}>
                            {/* 1. PROPERTY STRUCTURE */}
                            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                                <button onClick={() => setOpenSection(openSection === 'structure' ? null : 'structure')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all group">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                        <span className="material-symbols-outlined text-sm text-red-500/60">architecture</span>
                                        Property Structure
                                    </span>
                                    <span className={`material-symbols-outlined text-sm text-white/20 transition-transform duration-300 ${openSection === 'structure' ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'structure' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-4 pt-0 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className={L}>Bathrooms</label><input type="number" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: +e.target.value }))} className={F} /></div>
                                            <div><label className={L}>Balconies</label><input type="number" value={form.balconies} onChange={e => setForm(f => ({ ...f, balconies: +e.target.value }))} className={F} /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className={L}>Total Floors</label><input type="number" value={form.totalFloors} onChange={e => setForm(f => ({ ...f, totalFloors: +e.target.value }))} className={F} /></div>
                                            <div>
                                                <label className={L}>Unit Position</label>
                                                <select value={form.unitPosition} onChange={e => setForm(f => ({ ...f, unitPosition: e.target.value }))} className={F}>
                                                    {['Middle', 'Corner'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={L}>Parking</label>
                                                <select value={form.parking} onChange={e => setForm(f => ({ ...f, parking: e.target.value }))} className={F}>
                                                    {['None', 'Open', 'Covered'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={L}>Property Type</label>
                                                <select value={form.propertyType} onChange={e => setForm(f => ({ ...f, propertyType: e.target.value }))} className={F}>
                                                    {['Apartment', 'Villa', 'Independent House', 'Plot'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={L}>Servant Room</label>
                                                <select value={form.servantRoom} onChange={e => setForm(f => ({ ...f, servantRoom: e.target.value }))} className={F}>
                                                    {['No', 'Yes'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={L}>Study Room</label>
                                                <select value={form.studyRoom} onChange={e => setForm(f => ({ ...f, studyRoom: e.target.value }))} className={F}>
                                                    {['No', 'Yes'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. DIRECTION & VIEW */}
                            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                                <button onClick={() => setOpenSection(openSection === 'view' ? null : 'view')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all group">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                        <span className="material-symbols-outlined text-sm text-red-500/60">explore</span>
                                        Direction & View
                                    </span>
                                    <span className={`material-symbols-outlined text-sm text-white/20 transition-transform duration-300 ${openSection === 'view' ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'view' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-4 pt-0 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={L}>Main Door Facing</label>
                                                <select value={form.mainDoorFacing} onChange={e => setForm(f => ({ ...f, mainDoorFacing: e.target.value }))} className={F}>
                                                    {['East', 'West', 'North', 'South', 'North-East', 'South-East', 'North-West', 'South-West'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={L}>Balcony Facing</label>
                                                <select value={form.balconyFacing} onChange={e => setForm(f => ({ ...f, balconyFacing: e.target.value }))} className={F}>
                                                    {['East', 'West', 'North', 'South', 'North-East', 'South-East', 'North-West', 'South-West'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Park Facing', 'Garden View', 'Sea/Lake View', 'Road View'].map(v => {
                                                const key = v.toLowerCase().replace(/[\/\s]/g, '');
                                                const fieldKey = v === 'Park Facing' ? 'parkFacing' : v === 'Garden View' ? 'gardenView' : v === 'Sea/Lake View' ? 'seaLakeView' : 'roadView';
                                                return (
                                                    <div key={v}>
                                                        <label className={L}>{v}</label>
                                                        <select value={form[fieldKey]} onChange={e => setForm(f => ({ ...f, [fieldKey]: e.target.value }))} className={F + " px-2"}>
                                                            {['No', 'Yes'].map(o => <option key={o}>{o}</option>)}
                                                        </select>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. AMENITIES */}
                            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                                <button onClick={() => setOpenSection(openSection === 'amenities' ? null : 'amenities')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all group">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                        <span className="material-symbols-outlined text-sm text-red-500/60">pool</span>
                                        Amenities
                                    </span>
                                    <span className={`material-symbols-outlined text-sm text-white/20 transition-transform duration-300 ${openSection === 'amenities' ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'amenities' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-4 pt-0">
                                        <div className="flex flex-wrap gap-2">
                                            {['Lift', 'Power backup', 'Security', 'Gym', 'Swimming pool', 'Clubhouse', 'Children play area', 'Visitor parking', 'EV charging'].map(amenity => {
                                                const active = form.amenities.includes(amenity);
                                                return (
                                                    <button
                                                        key={amenity}
                                                        onClick={() => {
                                                            const newA = active ? form.amenities.filter(a => a !== amenity) : [...form.amenities, amenity];
                                                            setForm(f => ({ ...f, amenities: newA }));
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${active ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                                                    >
                                                        {amenity}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. BUILDING & LEGAL & INTENT */}
                            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                                <button onClick={() => setOpenSection(openSection === 'legal' ? null : 'legal')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all group">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                        <span className="material-symbols-outlined text-sm text-red-500/60">gavel</span>
                                        Building, Legal & Intent
                                    </span>
                                    <span className={`material-symbols-outlined text-sm text-white/20 transition-transform duration-300 ${openSection === 'legal' ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'legal' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-4 pt-0 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={L}>Builder Rank</label>
                                                <select value={form.builderReputation} onChange={e => setForm(f => ({ ...f, builderReputation: e.target.value }))} className={F}>
                                                    {['Standard', 'Premium', 'Unknown'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={L}>Investment Intent</label>
                                                <select value={form.intent} onChange={e => setForm(f => ({ ...f, intent: e.target.value }))} className={F}>
                                                    {['Self Use', 'Rental Income', 'Short Term Resale', 'Long Term Investment'].map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { label: 'RERA', key: 'reraApproved' },
                                                { label: 'OC Cert', key: 'occupancyCertificate' },
                                                { label: 'Gated', key: 'gatedCommunity' }
                                            ].map(item => (
                                                <div key={item.key}>
                                                    <label className={L}>{item.label}</label>
                                                    <select value={form[item.key]} onChange={e => setForm(f => ({ ...f, [item.key]: e.target.value }))} className={F + " px-2"}>
                                                        {['Yes', 'No'].map(o => <option key={o}>{o}</option>)}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 5. CONNECTIVITY */}
                            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                                <button onClick={() => setOpenSection(openSection === 'connectivity' ? null : 'connectivity')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-all group">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                        <span className="material-symbols-outlined text-sm text-red-500/60">directions_transit</span>
                                        Connectivity (km)
                                    </span>
                                    <span className={`material-symbols-outlined text-sm text-white/20 transition-transform duration-300 ${openSection === 'connectivity' ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'connectivity' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-4 pt-0 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className={L}>Metro Distance</label><input type="number" value={form.distanceMetro} onChange={e => setForm(f => ({ ...f, distanceMetro: +e.target.value }))} className={F} /></div>
                                            <div><label className={L}>Highway Access</label><input type="number" value={form.highwayAccess} onChange={e => setForm(f => ({ ...f, highwayAccess: +e.target.value }))} className={F} /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className={L}>Airport Dist.</label><input type="number" value={form.airportDistance} onChange={e => setForm(f => ({ ...f, airportDistance: +e.target.value }))} className={F} /></div>
                                            <div><label className={L}>Business Hubs</label><input type="number" value={form.businessHubDistance} onChange={e => setForm(f => ({ ...f, businessHubDistance: +e.target.value }))} className={F} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={handlePredict} disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(225,29,72,0.4)] flex items-center justify-center gap-3 disabled:opacity-60 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-15deg]"></div>
                            {loading ? <span className="flex items-center gap-2">Generating <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span></span> : <>Predict Price <span className="material-symbols-outlined text-base animate-pulse">auto_awesome</span></>}
                        </button>
                    </div>
                </div>

                <div>
                    {error ? (
                        <div className="bg-white/5 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
                            <span className="material-symbols-outlined text-5xl text-red-500">error</span>
                            <h3 className="text-lg font-bold text-white">Invalid Configuration</h3>
                            <p className="text-sm text-red-200">{error}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-4">Please adjust your inputs to continue</p>
                        </div>
                    ) : (result || loading) ? (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative h-full">
                            {/* Structured Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] mb-1">AI Intelligence</p>
                                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Market Valuation</h3>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowActions(!showActions)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-xl group"
                                    >
                                        <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${showActions ? 'rotate-90' : ''}`}>more_vert</span>
                                    </button>

                                    {showActions && (
                                        <>
                                            <div className="fixed inset-0 z-[60]" onClick={() => setShowActions(false)} />
                                            <div className="absolute top-12 right-0 w-44 bg-[#0a0a0c]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[70] animate-in fade-in zoom-in duration-200">
                                                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all group">
                                                    <span className="material-symbols-outlined text-sm text-red-500/60 group-hover:scale-110 transition-transform">bookmark</span>
                                                    Save Prediction
                                                </button>
                                                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all group">
                                                    <span className="material-symbols-outlined text-sm text-red-500/60 group-hover:scale-110 transition-transform">download</span>
                                                    Export Report (PDF)
                                                </button>
                                                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all group">
                                                    <span className="material-symbols-outlined text-sm text-red-500/60 group-hover:scale-110 transition-transform">share</span>
                                                    Share with Client
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* AI MAP & IMAGE VISUALIZATION */}
                            <div className="mb-8 relative rounded-2xl overflow-hidden aspect-video group bg-black/50">
                                <AnimatePresence mode="wait">
                                    {generatingImage && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md"
                                        >
                                            <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4"></div>
                                            <div className="text-xs font-bold text-white/60 uppercase tracking-widest animate-pulse">Generating Visualization...</div>
                                        </motion.div>
                                    )}
                                    {generatedImage && !generatingImage && (
                                        <motion.div
                                            initial={{ scale: 1.1, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="relative w-full h-full"
                                        >
                                            {/* Google Maps Embed - Colorful (no grayscale) */}
                                            <iframe
                                                className="w-full h-full border-0"
                                                loading="lazy"
                                                allowFullScreen
                                                referrerPolicy="no-referrer-when-downgrade"
                                                style={{ filter: 'none', WebkitFilter: 'none', colorScheme: 'light' }}
                                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(form.locality ? `${form.locality}, ${form.city}` : form.city)}&zoom=15&maptype=roadmap`}
                                            ></iframe>
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-40 pointer-events-none"></div>

                                            {/* VERIFY ON GOOGLE BUTTON */}
                                            <div className="absolute bottom-3 right-3 flex flex-col gap-2 items-end z-50 pointer-events-auto">
                                                <a
                                                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${form.bedrooms} BHK ${form.propertyType} in ${form.locality || form.city} real photos`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg flex items-center gap-2 transition-all group/btn cursor-pointer relative z-50"
                                                >
                                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3 h-3 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                                                    <span className="text-[10px] font-bold text-white/70 group-hover/btn:text-white uppercase tracking-wider transition-colors">View Real Images on Google</span>
                                                    <span className="material-symbols-outlined text-[10px] text-white/50 group-hover/btn:text-white transition-colors">open_in_new</span>
                                                </a>
                                                <a
                                                    href={`https://housing.com/in/buy/${encodeURIComponent(form.city.toLowerCase().replace(/\s+/g, '-'))}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 backdrop-blur-md border border-red-500/30 rounded-lg flex items-center gap-2 transition-all group/btn cursor-pointer relative z-50"
                                                >
                                                    <span className="text-[10px] font-bold text-red-100 group-hover/btn:text-white uppercase tracking-wider transition-colors">Check Housing.com</span>
                                                    <span className="material-symbols-outlined text-[10px] text-red-200 group-hover/btn:text-white transition-colors">apartment</span>
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="text-center mb-10">
                                <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-3">Estimated Property Value</p>
                                {result ? (
                                    <>
                                        <div className="text-6xl font-['Anton'] text-white tracking-wide mb-3 animate-in zoom-in duration-500">{formatPrice(result.predicted)}</div>
                                        <div className="inline-block px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                                            <p className="text-xs text-red-400 font-bold tracking-tight">Range: {formatPrice(result.low)} — {formatPrice(result.high)}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-24 flex items-center justify-center">
                                        <div className="text-white/20 text-sm font-bold uppercase tracking-widest animate-pulse">Calculating...</div>
                                    </div>
                                )}
                            </div>
                            {result && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                                >
                                    <motion.div 
                                        className="grid grid-cols-2 gap-4 mb-6"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5 hover:border-red-500/30 transition-colors">
                                            <div className="text-2xl font-['Anton'] text-green-600">{result.confidence}%</div>
                                            <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-1">AI Confidence</div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5 hover:border-red-500/30 transition-colors">
                                            <div className="text-2xl font-['Anton'] text-white">₹{result.pricePerSqft.toLocaleString()}</div>
                                            <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-1">Per Sq.Ft Base</div>
                                        </div>
                                    </motion.div>
                                    <motion.div 
                                        className="h-48"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mb-3">12-Month Market Trend (₹ Lakhs)</p>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trendData}>
                                                <defs>
                                                    <linearGradient id="cp" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={ACCENT} stopOpacity={0.15} />
                                                        <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis dataKey="month" hide />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Area type="monotone" dataKey="avgPrice" stroke={ACCENT} fill="url(#cp)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <EmptyState icon="query_stats" title="Fill in the details and click predict" subtitle="Our AI will analyze market data to give you an estimate" />
                    )}
                </div>
            </div>

            {/* NEW SECTIONS BELOW */}
            {result && (
                <>
                    {/* SECTION 1: PRICE BREAKDOWN */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <span className="material-symbols-outlined text-red-500 text-lg">analytics</span>
                                Price Contribution Breakdown
                            </h4>
                            <button className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-wider">View Detailed Audit</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {factors.map(f => (
                                <div key={f.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center group hover:bg-white/10 transition-all duration-300">
                                    <span className="material-symbols-outlined text-white/30 mb-2 block group-hover:text-red-500 transition-colors">{f.icon}</span>
                                    <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">{f.label}</div>
                                    <div className="text-xl font-['Anton'] text-white">{f.value}%</div>
                                    <div className={`text-[9px] font-bold mt-1 ${f.trend.startsWith('+') ? 'text-green-500' : f.trend.startsWith('-') ? 'text-red-500' : 'text-blue-500'}`}>{f.trend}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 2: COMPARABLE PROPERTIES */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <span className="material-symbols-outlined text-red-500 text-lg">compare</span>
                                Comparable Market Assets
                            </h4>
                            <button className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-wider bg-white/5 px-4 py-1.5 rounded-full border border-white/10 transition-all">View All in {form.city}</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {properties.filter(p => p.city === form.city).slice(0, 3).map(p => (
                                <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-red-500/30 transition-all duration-500">
                                    <div className="relative h-32 overflow-hidden">
                                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[8px] text-white font-bold px-2 py-1 rounded-md border border-white/10">0.8 km away</div>
                                    </div>
                                    <div className="p-4">
                                        <h5 className="text-[11px] font-bold text-white mb-2 truncate group-hover:text-red-500 transition-colors">{p.name}</h5>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="text-[9px] text-white/40 font-bold uppercase">{p.bedrooms} BHK • {p.sqft} SQFT</div>
                                            <div className="text-[10px] text-green-500 font-bold">+4.2% Growth</div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-sm font-['Anton'] text-white">{formatPrice(p.price)}</div>
                                                <div className="text-[8px] text-white/40 uppercase font-bold tracking-tighter">₹{p.pricePerSqft.toLocaleString()}/sqft</div>
                                            </div>
                                            <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all">
                                                <span className="material-symbols-outlined text-sm text-white">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 3 & 4 Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* SECTION 3: EMI & AFFORDABILITY */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-red-500 text-lg">account_balance_wallet</span>
                                    Affordability Analysis
                                </h4>
                                <button className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-wider">Adjust Loan</button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3">Down Payment <span className="text-white">{loanParams.down}%</span></label>
                                        <input type="range" min="5" max="50" step="5" value={loanParams.down} onChange={e => setLoanParams(p => ({ ...p, down: +e.target.value }))} className="w-full accent-red-600 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                            <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Tenure</div>
                                            <div className="text-xs font-bold text-white">{loanParams.tenure} Years</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                            <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Rate</div>
                                            <div className="text-xs font-bold text-white">{loanParams.rate}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center text-center bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl p-6">
                                    <div className="text-3xl font-['Anton'] text-white mb-1">{formatPrice(emiData?.emi || 0)}</div>
                                    <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Estimated Monthly EMI</div>
                                    <div className="h-px bg-white/10 w-12 mx-auto mb-4" />
                                    <div className="text-[10px] font-bold text-blue-500">Tier 1 Eligibility Match</div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: INVESTMENT SCORE */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 blur-[60px] group-hover:bg-red-600/20 transition-all duration-1000"></div>
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-red-500 text-lg">insights</span>
                                    Investment Potential
                                </h4>
                                <div className="bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/20">GRADE A+</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'ROI Potential', value: '14.2%', sub: 'Annual', icon: 'trending_up' },
                                    { label: 'Rental Yield', value: '4.8%', sub: 'Avg Net', icon: 'key' },
                                    { label: 'Liquidity', value: 'High', sub: '32 Days', icon: 'water' },
                                    { label: 'Risk Factor', value: 'Low', sub: 'Stable', icon: 'gpp_maybe' },
                                ].map(m => (
                                    <div key={m.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="material-symbols-outlined text-white/20 text-lg">{m.icon}</span>
                                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{m.label}</span>
                                        </div>
                                        <div className="text-xl font-['Anton'] text-white">{m.value}</div>
                                        <div className="text-[9px] font-bold text-white/40">{m.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: LOCALITY INSIGHTS */}
                    <div>
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <span className="material-symbols-outlined text-red-500 text-lg">home_pin</span>
                                Locality Intel • {form.city}
                            </h4>
                            <div className="text-[10px] font-bold text-white/30 italic">Real-time lifestyle engine data</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                            {localityStats.map(s => (
                                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                                        <span className="material-symbols-outlined text-xl" style={{ color: s.color }}>{s.icon}</span>
                                    </div>
                                    <div className="text-2xl font-['Anton'] text-white mb-1">{s.value}</div>
                                    <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FINAL CTA */}
                    <div className="pt-4 flex justify-center">
                        <Link href="/analytics" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-4">
                            See Full Market Forecast 2026
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

// ==================== 4. FINANCIAL TAB ====================
function FinancialTab() {
    const [price, setPrice] = useState(10000000);
    const [down, setDown] = useState(20);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const loanAmt = price * (1 - down / 100);
    const r = rate / 100 / 12;
    const n = tenure * 12;
    const emi = Math.round(loanAmt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const totalPay = emi * n;
    const totalInt = totalPay - loanAmt;
    const [preApproval, setPreApproval] = useState('documents_submitted');
    const stages = ['application', 'documents_submitted', 'verification', 'approved'];
    const stageLabels = { application: 'Application', documents_submitted: 'Documents', verification: 'Verification', approved: 'Approved' };
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calculator */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-white text-sm mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-red-500">calculate</span>EMI / Mortgage Calculator</h3>
                    <div className="space-y-5">
                        <div><label className="flex justify-between text-xs font-semibold text-white/50 mb-2"><span>Property Price</span><span className="text-white font-bold">{formatPrice(price)}</span></label>
                            <input type="range" min={1000000} max={100000000} step={500000} value={price} onChange={e => setPrice(+e.target.value)} className="w-full accent-red-600" /></div>
                        <div><label className="flex justify-between text-xs font-semibold text-white/50 mb-2"><span>Down Payment</span><span className="text-white font-bold">{down}% ({formatPrice(price * down / 100)})</span></label>
                            <input type="range" min={5} max={50} value={down} onChange={e => setDown(+e.target.value)} className="w-full accent-red-600" /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="flex justify-between text-xs font-semibold text-white/50 mb-2"><span>Interest</span><span className="text-white font-bold">{rate}%</span></label>
                                <input type="range" min={5} max={15} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-red-600" /></div>
                            <div><label className="flex justify-between text-xs font-semibold text-white/50 mb-2"><span>Tenure</span><span className="text-white font-bold">{tenure} yrs</span></label>
                                <input type="range" min={5} max={30} value={tenure} onChange={e => setTenure(+e.target.value)} className="w-full accent-red-600" /></div>
                        </div>
                    </div>
                </div>
                {/* Breakdown */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-white text-sm mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-green-500">payments</span>Payment Breakdown</h3>
                    <div className="text-center mb-6">
                        <div className="text-4xl font-['Anton'] text-white tracking-wide">{formatPrice(emi)}</div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">Monthly EMI</div>
                    </div>
                    <div className="space-y-3">
                        {[['Loan Amount', loanAmt, '#3b82f6'], ['Total Interest', totalInt, '#ef4444'], ['Total Payment', totalPay, '#fff']].map(([l, v, c]) => (
                            <div key={l} className="flex justify-between items-center text-xs"><span className="text-white/60 flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: c }}></span>{l}</span><span className="font-bold text-white">{formatPrice(v)}</span></div>
                        ))}
                    </div>
                    <div className="mt-4 h-4 rounded-full overflow-hidden flex" title="Loan vs Interest">
                        <div style={{ width: `${loanAmt / totalPay * 100}%` }} className="bg-blue-500"></div>
                        <div style={{ width: `${totalInt / totalPay * 100}%` }} className="bg-red-400"></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-white/40 mt-1"><span>Principal {(loanAmt / totalPay * 100).toFixed(0)}%</span><span>Interest {(totalInt / totalPay * 100).toFixed(0)}%</span></div>
                </div>
            </div>
            {/* Pre-Approval Tracker */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white text-sm mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-purple-500">verified</span>Pre-Approval Tracker</h3>
                <div className="flex items-center justify-between mb-4">
                    {stages.map((s, i) => {
                        const idx = stages.indexOf(preApproval); const done = i <= idx;
                        return <React.Fragment key={s}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${done ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40'}`}>{done ? '✓' : i + 1}</div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${done ? 'text-green-600' : 'text-white/40'}`}>{stageLabels[s]}</span>
                            </div>
                            {i < stages.length - 1 && <div className={`h-0.5 flex-1 mx-2 rounded ${i < idx ? 'bg-green-400' : 'bg-white/10'}`}></div>}
                        </React.Fragment>
                    })}
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-xs text-green-700 font-medium flex items-center gap-2"><span className="material-symbols-outlined text-sm">info</span>Your documents have been submitted. Verification is expected within 3-5 business days.</div>
            </div>
        </div>
    );
}

// ==================== 5. SAVED TAB ====================
function SavedTab({ savedIds, onSave, onSelect }) {
    const saved = properties.filter(p => savedIds.has(p.id));
    const [compareMode, setCompareMode] = useState(false);
    const [compareIds, setCompareIds] = useState([]);
    const toggle = id => setCompareIds(p => p.includes(id) ? p.filter(i => i !== id) : p.length < 3 ? [...p, id] : p);
    const compared = properties.filter(p => compareIds.includes(p.id));
    return (
        <div className="space-y-6">
            {/* Saved Searches */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-red-500">saved_search</span>Saved Searches</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{savedSearches.map(s => (
                    <div key={s.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-white">{s.name}</span>{s.newMatches > 0 && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{s.newMatches}</span>}</div>
                        <div className="text-[10px] text-white/40">{s.matches} matches • Created {s.created}</div>
                    </div>
                ))}</div>
            </div>
            {/* Saved Properties */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-white/40">{saved.length} saved properties</p>
                {saved.length >= 2 && <button onClick={() => { setCompareMode(!compareMode); setCompareIds([]); }} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${compareMode ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>{compareMode ? 'Exit Compare' : 'Compare'}</button>}
            </div>
            {saved.length === 0 ? <EmptyState icon="bookmark_border" title="No saved properties yet" subtitle="Browse Discovery and save properties you like" /> : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {saved.map(p => <div key={p.id} className="relative">{compareMode && <button onClick={() => toggle(p.id)} className={`absolute top-4 left-4 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${compareIds.includes(p.id) ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-navy/20'}`}>{compareIds.includes(p.id) && '✓'}</button>}<PropertyCard property={p} saved onSave={onSave} onSelect={onSelect} /></div>)}
                    </div>
                    {compareMode && compared.length >= 2 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                            <div className="p-5 border-b border-white/10"><h3 className="font-bold text-white text-sm uppercase tracking-wider">Property Comparison</h3></div>
                            <div className="overflow-x-auto"><table className="w-full text-xs">
                                <thead><tr className="bg-white/5"><th className="px-4 py-2 text-left text-white/40 font-bold uppercase tracking-wider">Feature</th>{compared.map(p => <th key={p.id} className="px-4 py-2 text-left text-red-500 font-bold uppercase tracking-wider">{p.name}</th>)}</tr></thead>
                                <tbody>{[['Price', p => formatPrice(p.price)], ['Per Sqft', p => `₹${p.pricePerSqft.toLocaleString()}`], ['Area', p => `${p.sqft} sqft`], ['BHK', p => p.bedrooms], ['Type', p => p.type], ['City', p => p.city], ['Age', p => `${p.age} yrs`], ['Safety', p => `${p.safetyScore}/100`], ['Commute', p => `${p.commuteScore}/100`], ['Resale', p => `${p.resalePotential}%`], ['HOA', p => formatPrice(p.hoaMonthly) + '/mo'], ['Rent Est.', p => formatPrice(p.rentEstimate) + '/mo']].map(([l, fn]) => (
                                    <tr key={l} className="border-t border-white/5"><td className="px-4 py-2 text-white/40 font-medium">{l}</td>{compared.map(p => <td key={p.id} className="px-4 py-2 font-semibold text-white">{fn(p)}</td>)}</tr>
                                ))}</tbody>
                            </table></div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ==================== 6. ACTIONS TAB ====================
function ActionsTab({ tourRequests: localTours, buyerOffers: localOffers }) {
    const [activePanel, setActivePanel] = useState('tours');
    const toursToDisplay = [...(localTours || []), ...tourRequests];
    const offersToDisplay = [...(localOffers || []), ...buyerOffers];
    const panels = [['tours', 'Tours', 'event'], ['offers', 'Offers', 'gavel'], ['share', 'Share', 'share'], ['contact', 'Contact', 'chat']];
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-6">{panels.map(([id, l, ic]) => (
                <button key={id} onClick={() => setActivePanel(id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activePanel === id ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/40 hover:text-white/80'}`}>
                    <span className="material-symbols-outlined text-base">{ic}</span>{l}
                </button>
            ))}</div>
            {activePanel === 'tours' && <div className="space-y-4">
                <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-white text-sm">Scheduled Tours</h3></div>
                {toursToDisplay.length === 0 ? <EmptyState icon="event" title="No tours scheduled" subtitle="Request a tour from the property details page" /> : toursToDisplay.map(t => (
                    <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : t.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/10 text-white/40'}`}><span className="material-symbols-outlined text-xl">event</span></div>
                            <div><div className="text-sm font-bold text-white">{t.propertyName}</div><div className="text-[11px] text-white/60">{t.date} at {t.time} • Agent: {t.agentName}</div></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : t.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/10 text-white/40'}`}>{t.status}</span>
                            {t.status !== 'completed' && <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-500 hover:bg-red-500/10">Cancel</button>}
                        </div>
                    </div>
                ))}
            </div>}
            {activePanel === 'offers' && <div className="space-y-4">
                <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-white text-sm">My Offers</h3></div>
                {offersToDisplay.length === 0 ? <EmptyState icon="gavel" title="No offers made" subtitle="Make an offer on properties you love" /> : offersToDisplay.map(o => (
                    <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3"><div className="text-sm font-bold text-white">{o.propertyName}</div><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : o.status === 'accepted' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{o.status}</span></div>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                            <div><span className="text-white/40 uppercase text-[9px] font-bold tracking-wider">Your Offer</span><div className="font-bold text-white">{formatPrice(o.offerPrice)}</div></div>
                            <div><span className="text-white/40 uppercase text-[9px] font-bold tracking-wider">List Price</span><div className="font-bold text-white">{formatPrice(o.listPrice)}</div></div>
                            <div><span className="text-white/40 uppercase text-[9px] font-bold tracking-wider">Submitted</span><div className="font-bold text-white">{o.submittedDate}</div></div>
                        </div>
                        {o.response && <div className="mt-3 p-3 bg-purple-500/10 rounded-xl text-[11px] text-purple-400 font-medium">{o.response}</div>}
                        <div className="flex gap-2 mt-3"><button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/50 hover:bg-white/10">Edit</button><button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-500 hover:bg-red-500/10">Withdraw</button></div>
                    </div>
                ))}
            </div>}
            {activePanel === 'share' && <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-white/10 mb-4 block">share</span>
                <h3 className="font-bold text-white mb-2">Share Properties</h3>
                <p className="text-xs text-white/40 mb-6">Share your saved properties with family, friends, or your agent</p>
                <div className="flex justify-center gap-3">
                    {[['Email', 'email', '#ea4335'], ['WhatsApp', 'chat', '#25d366'], ['Copy Link', 'link', '#6b7280']].map(([l, ic, c]) => (
                        <button key={l} className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5" style={{ background: c }}><span className="material-symbols-outlined text-sm">{ic}</span>{l}</button>
                    ))}
                </div>
            </div>}
            {activePanel === 'contact' && <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-red-500">support_agent</span>Contact Agent</h3>
                <div className="space-y-3">
                    <input placeholder="Your message..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10" />
                    <div className="flex gap-2"><button className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 shadow-lg shadow-red-500/20">Send Message</button><button className="px-5 py-2.5 bg-white/5 text-white/50 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10">Request Call</button></div>
                </div>
            </div>}
        </div>
    );
}

// ==================== 7. JOURNEY TAB ====================
function JourneyTab() {
    const currentStage = 'offer_submitted';
    const stageIdx = buyerPipelineStages.indexOf(currentStage);
    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white text-sm mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-red-500">route</span>Transaction Pipeline</h3>
                <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {buyerPipelineStages.map((s, i) => (<React.Fragment key={s}>
                        <div className="flex flex-col items-center min-w-[80px]">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all ${i <= stageIdx ? 'text-white shadow-lg' : 'bg-white/10 text-white/20'}`} style={i <= stageIdx ? { background: buyerPipelineColors[s], boxShadow: `0 4px 12px ${buyerPipelineColors[s]}40` } : {}}>
                                {i < stageIdx ? '✓' : i + 1}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${i <= stageIdx ? 'text-white' : 'text-white/20'}`}>{buyerPipelineLabels[s]}</span>
                        </div>
                        {i < buyerPipelineStages.length - 1 && <div className={`h-0.5 flex-1 mx-1 rounded ${i < stageIdx ? 'bg-green-400' : 'bg-white/10'}`} style={i < stageIdx ? { background: buyerPipelineColors[buyerPipelineStages[i + 1]] } : {}}></div>}
                    </React.Fragment>))}
                </div>
                <div className="bg-amber-900/10 rounded-xl p-4 text-xs text-amber-500 font-bold uppercase tracking-wider flex items-center gap-2 border border-amber-900/20"><span className="material-symbols-outlined text-sm">pending</span>Your offer on Lakeside Manor is under review. Expected response within 48 hours.</div>
            </div>
            {/* Activity Timeline */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white text-sm mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">history</span>Activity Timeline</h3>
                <div className="space-y-0">
                    {activityTimeline.map((a, i) => {
                        const typeColors = { save: '#c93a2a', tour: '#3b82f6', offer: '#8b5cf6', alert: '#f59e0b', search: '#22c55e', view: '#6b7280', compare: '#ec4899' };
                        return (
                            <div key={a.id} className="flex gap-4 pb-6 relative">
                                {i < activityTimeline.length - 1 && <div className="absolute left-5 top-10 w-0.5 h-full bg-white/5"></div>}
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${typeColors[a.type] || '#6b7280'}20` }}>
                                    <span className="material-symbols-outlined text-base" style={{ color: typeColors[a.type] || '#6b7280' }}>{a.icon}</span>
                                </div>
                                <div><div className="text-sm font-bold text-white">{a.action}</div><div className="text-xs text-white/50">{a.detail}</div><div className="text-[10px] text-white/30 font-medium mt-1 uppercase tracking-wider">{a.time}</div></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

// ==================== 8. SMART PICKS TAB ====================
function SmartPicksTab({ savedIds, onSave, onSelect }) {
    const recs = getRecommendations(savedIds);
    return (
        <div>
            <div className="bg-gradient-to-r from-red-900/40 to-rose-900/40 rounded-2xl p-6 mb-6 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-2xl text-red-500 animate-pulse">auto_awesome</span><h3 className="font-bold text-white text-lg">AI-Powered Recommendations</h3></div>
                <p className="text-xs text-white/40 font-medium">Based on your saved properties, search behavior, and price range preferences</p>
            </div>
            {recs.length === 0 ? <EmptyState icon="recommend" title="Save some properties first" subtitle="We'll analyze your preferences to suggest similar homes" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{recs.map(p => (
                    <div key={p.id} className="relative">
                        <div className="absolute top-3 right-12 z-10 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-[9px] font-bold text-white shadow-lg">{p.matchScore}% match</div>
                        <PropertyCard property={p} saved={savedIds.has(p.id)} onSave={onSave} onSelect={onSelect} />
                    </div>
                ))}</div>
            )}
        </div>
    );
}

// ==================== MAIN PAGE ====================
const tabs = [
    { id: 'predictor', label: 'AI Predictor', icon: 'auto_awesome', highlight: true },
    { id: 'discovery', label: 'Discovery', icon: 'explore' },
    { id: 'saved', label: 'Saved', icon: 'bookmark' }
];

export default function BuyerPage() {
    const [notification, setNotification] = useState(null);
    const [savedIds, setSavedIds] = useState(new Set());
    const [localTourRequests, setLocalTourRequests] = useState([]);
    const [localOffers, setLocalOffers] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [activeTab, setActiveTab] = useState('predictor');

    // Lifted predictor state — persists across tab switches for deterministic results
    const [predictorForm, setPredictorForm] = useState(PREDICTOR_DEFAULTS);
    const [predictorResult, setPredictorResult] = useState(null);
    const [predictorHasPredicted, setPredictorHasPredicted] = useState(false);
    const [predictorImage, setPredictorImage] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        const saved = localStorage.getItem('buyerSavedIds');
        if (saved) setSavedIds(new Set(JSON.parse(saved)));

        const tours = localStorage.getItem('buyerTourRequests');
        if (tours) setLocalTourRequests(JSON.parse(tours));

        const offers = localStorage.getItem('buyerOffers');
        if (offers) setLocalOffers(JSON.parse(offers));
    }, []);

    const toggleSave = id => {
        setSavedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            localStorage.setItem('buyerSavedIds', JSON.stringify(Array.from(next)));
            showNotification(next.has(id) ? 'Property saved to your favorites!' : 'Removed from favorites');
            return next;
        });
    };

    const handleTourRequest = (property) => {
        const newRequest = {
            id: Date.now(),
            propertyId: property.id,
            propertyName: property.name,
            date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days later
            time: "11:00 AM",
            status: "pending",
            agentName: "Arjun Reddy",
            type: 'tour'
        };
        const updated = [newRequest, ...localTourRequests];
        setLocalTourRequests(updated);
        localStorage.setItem('buyerTourRequests', JSON.stringify(updated));
        showNotification('Tour request sent to agent!', 'success');
    };

    const handleMakeOffer = (property) => {
        const offerPrice = Math.round(property.price * 0.95); // 5% below list
        const newOffer = {
            id: Date.now(),
            propertyId: property.id,
            propertyName: property.name,
            offerPrice,
            listPrice: property.price,
            status: "pending",
            submittedDate: new Date().toISOString().split('T')[0],
            type: 'offer'
        };
        const updated = [newOffer, ...localOffers];
        setLocalOffers(updated);
        localStorage.setItem('buyerOffers', JSON.stringify(updated));
        showNotification('Offer submitted to seller via agent!', 'success');
    };

    const selectProp = p => { setSelectedProperty(p); setActiveTab('detail'); };

    return (
        <AuthGuard>
            <div className="relative min-h-screen text-white">
                <div className="absolute inset-0 z-0">
                    <BackgroundPaths title="" showCta={false} />
                </div>
                <div className="relative z-10 pt-32 pb-20 px-4 md:px-8">
                    <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">

                        <SectionHeader
                            icon="shopping_bag"
                            title="BUYER DASHBOARD • AI PREDICTOR" subtitle="AI Valuations • Discover • Analyze • Finance" accent={ACCENT} />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatCard icon="home" label="Properties Available" value={properties.filter(p => p.status === 'active').length} trend="12" color={ACCENT} />
                            <StatCard icon="bookmark" label="Saved Properties" value={savedIds.size} color="#3b82f6" />
                            <StatCard icon="event" label="Upcoming Tours" value={tourRequests.filter(t => t.status !== 'completed').length} color="#22c55e" />
                            <StatCard icon="gavel" label="Active Offers" value={buyerOffers.length} color="#8b5cf6" />
                        </div>
                        <TabBar tabs={tabs.map(t => ({ ...t, badge: t.id === 'saved' ? savedIds.size : t.id === 'actions' ? notifications.filter(n => !n.read).length : 0 }))} active={activeTab} onChange={setActiveTab} accent={ACCENT} />
                        {activeTab === 'discovery' && <DiscoveryTab savedIds={savedIds} onSave={toggleSave} onSelect={selectProp} />}
                        {activeTab === 'detail' && <PropertyDetailTab selectedProperty={selectedProperty} savedIds={savedIds} onSave={toggleSave} handleTourRequest={handleTourRequest} handleMakeOffer={handleMakeOffer} />}
                        {activeTab === 'predictor' && <PredictorTab form={predictorForm} setForm={setPredictorForm} result={predictorResult} setResult={setPredictorResult} hasPredicted={predictorHasPredicted} setHasPredicted={setPredictorHasPredicted} generatedImage={predictorImage} setGeneratedImage={setPredictorImage} />}
                        {activeTab === 'financial' && <FinancialTab />}
                        {activeTab === 'saved' && <SavedTab savedIds={savedIds} onSave={toggleSave} onSelect={selectProp} />}
                        {activeTab === 'actions' && <ActionsTab tourRequests={localTourRequests} buyerOffers={localOffers} />}
                        {activeTab === 'journey' && <JourneyTab />}
                        {activeTab === 'smart' && <SmartPicksTab savedIds={savedIds} onSave={toggleSave} onSelect={selectProp} />}
                    </div>
                </div>

                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl bg-black border border-white/10 shadow-2xl shadow-red-600/20"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                <span className="material-symbols-outlined text-sm">{notification.type === 'success' ? 'check' : 'close'}</span>
                            </div>
                            <p className="text-sm font-bold text-white tracking-wide">{notification.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthGuard>
    );
}

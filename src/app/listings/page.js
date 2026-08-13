"use client";
import React, { useState, useEffect, useMemo } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { properties, formatPrice } from '@/lib/mockData';
import { Search, Filter, Heart, X, Check, Shield, MapPin, Bed, Bath, Square, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Listings() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [savedIds, setSavedIds] = useState(new Set());
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [localProps, setLocalProps] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('buyerSavedIds');
            if (saved) try { setSavedIds(new Set(JSON.parse(saved))); } catch (e) {}

            const userProps = localStorage.getItem('userProperties');
            if (userProps) try { setLocalProps(JSON.parse(userProps)); } catch (e) {}
        }
    }, []);

    const allListings = useMemo(() => [...localProps, ...properties], [localProps]);

    const cities = useMemo(() => [...new Set(allListings.map(p => p.city))].sort(), [allListings]);
    const types = useMemo(() => [...new Set(allListings.map(p => p.type || 'Apartment'))].sort(), [allListings]);

    const toggleSave = (id, e) => {
        e?.stopPropagation();
        setSavedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            localStorage.setItem('buyerSavedIds', JSON.stringify(Array.from(next)));
            return next;
        });
    };

    const filteredProperties = useMemo(() => {
        return allListings.filter(p => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.locality.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
            const matchesCity = !selectedCity || p.city === selectedCity;
            const matchesType = !selectedType || (p.type || 'Apartment') === selectedType;
            const matchesPrice = !maxPrice || p.price <= parseInt(maxPrice);
            return matchesSearch && matchesCity && matchesType && matchesPrice;
        });
    }, [allListings, searchQuery, selectedCity, selectedType, maxPrice]);

    return (
        <AuthGuard>
            <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 bg-[#050505] text-white">
                <div className="max-w-[1300px] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
                            Verified Real Estate Marketplace
                        </span>
                        <h1 className="text-4xl md:text-6xl font-['Anton'] tracking-wide mb-4">Explore Premium Properties</h1>
                        <p className="text-white/50 text-sm md:text-base max-w-[600px] mx-auto leading-relaxed">
                            Discover high-yield properties across India, verified with AI pricing precision and hyper-local security insights.
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-12 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 flex-1 min-w-[240px]">
                            <Search size={18} className="text-white/40" />
                            <input
                                type="text"
                                placeholder="Search by property, street, or city..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-xs text-white focus:outline-none placeholder:text-white/30"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            <select
                                value={selectedCity}
                                onChange={e => setSelectedCity(e.target.value)}
                                className="bg-black/60 border border-white/10 text-white text-xs font-bold uppercase rounded-xl px-3.5 py-2.5 focus:outline-none cursor-pointer"
                            >
                                <option value="">All Cities</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select
                                value={selectedType}
                                onChange={e => setSelectedType(e.target.value)}
                                className="bg-black/60 border border-white/10 text-white text-xs font-bold uppercase rounded-xl px-3.5 py-2.5 focus:outline-none cursor-pointer"
                            >
                                <option value="">All Types</option>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>

                            <select
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                className="bg-black/60 border border-white/10 text-white text-xs font-bold uppercase rounded-xl px-3.5 py-2.5 focus:outline-none cursor-pointer"
                            >
                                <option value="">Max Price</option>
                                <option value="10000000">₹1 Cr</option>
                                <option value="30000000">₹3 Cr</option>
                                <option value="50000000">₹5 Cr</option>
                                <option value="100000000">₹10 Cr</option>
                            </select>

                            {(searchQuery || selectedCity || selectedType || maxPrice) && (
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCity(''); setSelectedType(''); setMaxPrice(''); }}
                                    className="text-xs font-bold uppercase text-red-400 hover:text-red-300 px-3 py-2"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map((property) => {
                            const isSaved = savedIds.has(property.id);
                            return (
                                <div
                                    key={property.id}
                                    onClick={() => setSelectedProperty(property)}
                                    className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer backdrop-blur-sm"
                                >
                                    {/* Image */}
                                    <div className="relative h-60 overflow-hidden bg-slate-800">
                                        <img
                                            src={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"}
                                            alt={property.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                                                {property.status || 'Active'}
                                            </span>
                                            <span className="bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                                AI Valued
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => toggleSave(property.id, e)}
                                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 transition-all cursor-pointer"
                                        >
                                            <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : "text-white/70"} />
                                        </button>

                                        <div className="absolute bottom-4 left-4">
                                            <div className="text-2xl font-['Anton'] text-white tracking-wide">{formatPrice(property.price)}</div>
                                            <div className="text-[10px] text-white/50 font-semibold">₹{(property.pricePerSqft || Math.round(property.price / (property.sqft || 1))).toLocaleString()}/sqft</div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">{property.name}</h3>
                                            <p className="text-xs text-white/50 flex items-center gap-1 mb-3">
                                                <MapPin size={12} className="text-red-500" />
                                                {property.locality}, {property.city}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-white/70 pt-3 border-t border-white/5">
                                                <span className="flex items-center gap-1.5"><Bed size={14} className="text-white/40" /> {property.bedrooms} BHK</span>
                                                <span className="flex items-center gap-1.5"><Bath size={14} className="text-white/40" /> {property.bathrooms || 2} Bath</span>
                                                <span className="flex items-center gap-1.5"><Square size={14} className="text-white/40" /> {property.sqft} sqft</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-xs font-bold text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                View Details <ArrowRight size={14} />
                                            </span>
                                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold">
                                                {property.safetyScore || 90}% Safety
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredProperties.length === 0 && (
                        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                            <Filter size={40} className="mx-auto text-white/20 mb-3" />
                            <h3 className="text-lg font-bold text-white mb-1">No matching properties found</h3>
                            <p className="text-xs text-white/40">Try adjusting your filters or search keywords.</p>
                        </div>
                    )}
                </div>

                {/* Property Detail Modal */}
                <AnimatePresence>
                    {selectedProperty && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-2xl bg-[#0f0f12] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                            >
                                <button
                                    onClick={() => setSelectedProperty(null)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>

                                <div className="h-64 rounded-2xl overflow-hidden relative mb-6">
                                    <img src={selectedProperty.image} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-4 left-4 text-3xl font-['Anton'] text-white drop-shadow-md">
                                        {formatPrice(selectedProperty.price)}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">{selectedProperty.name}</h2>
                                <p className="text-xs text-white/60 mb-4 flex items-center gap-1">
                                    <MapPin size={14} className="text-red-500" />
                                    {selectedProperty.locality}, {selectedProperty.city}
                                </p>

                                <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mb-6 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-white">{selectedProperty.bedrooms} BHK</div>
                                        <div className="text-[10px] text-white/40 uppercase">Bedrooms</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">{selectedProperty.sqft}</div>
                                        <div className="text-[10px] text-white/40 uppercase">Sq. Ft</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-emerald-400">{selectedProperty.safetyScore || 92}%</div>
                                        <div className="text-[10px] text-white/40 uppercase">Safety Score</div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Link
                                        href={`/buyer?property=${selectedProperty.id}`}
                                        className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white text-center font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/20"
                                    >
                                        Inspect & Schedule Tour
                                    </Link>
                                    <button
                                        onClick={(e) => toggleSave(selectedProperty.id, e)}
                                        className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                                    >
                                        <Heart size={16} className={savedIds.has(selectedProperty.id) ? "fill-red-500 text-red-500" : ""} />
                                        {savedIds.has(selectedProperty.id) ? 'Saved' : 'Save'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AuthGuard>
    );
}

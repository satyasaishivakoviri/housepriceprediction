"use client";
import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { TabBar, StatCard, SectionHeader, EmptyState, ProgressRing } from '@/components/ui/RoleTheme';
import { properties, cityData, formatPrice, formatNumber } from '@/lib/mockData';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    LayoutDashboard,
    Home,
    TrendingUp,
    Users,
    FileText,
    Calendar,
    Zap,
    Brain,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    Copy,
    ChevronRight,
    Mail,
    Phone,
    MessageSquare,
    Check,
    X,
    Upload,
    ArrowUpRight,
    ArrowDownRight,
    Camera,
    Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ACCENT = '#c93a2a';

export default function SellerPage() {
    const [activeTab, setActiveTab] = useState('listings');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [mlProcessing, setMlProcessing] = useState(false);
    const [mlFeedback, setMlFeedback] = useState("");
    const [selectedCity, setSelectedCity] = useState('Mumbai');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [localProperties, setLocalProperties] = useState([]);
    const [newProperty, setNewProperty] = useState({
        name: '',
        locality: '',
        city: 'Mumbai',
        price: '',
        bedrooms: '',
        sqft: '',
        description: '',
        image: '',
        features: ''
    });

    const [notification, setNotification] = useState(null);
    const [editingProperty, setEditingProperty] = useState(null);
    const [previewProperty, setPreviewProperty] = useState(null);
    const [leadActionModal, setLeadActionModal] = useState(null);
    const [docModal, setDocModal] = useState(null);
    const [boostActive, setBoostActive] = useState(false);
    const [priceAdjusted, setPriceAdjusted] = useState(false);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        const saved = localStorage.getItem('userProperties');
        if (saved) {
            try { setLocalProperties(JSON.parse(saved)); } catch (e) {}
        }
    }, []);

    const allIndianCities = ["Agra", "Ahmedabad", "Amritsar", "Bangalore", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Coimbatore", "Dehradun", "Delhi", "Faridabad", "Ghaziabad", "Gurgaon", "Guwahati", "Hyderabad", "Indore", "Jaipur", "Jamshedpur", "Kanpur", "Kochi", "Kolkata", "Lucknow", "Ludhiana", "Madurai", "Mangalore", "Meerut", "Mumbai", "Mysore", "Nagpur", "Nashik", "Noida", "Patna", "Pune", "Raipur", "Rajkot", "Ranchi", "Surat", "Thiruvananthapuram", "Vadodara", "Varanasi", "Visakhapatnam"];

    // Get unique cities from all properties
    const cities = [...new Set([...localProperties, ...properties].map(p => p.city))].sort();

    const executeMLTask = (taskName) => {
        setMlProcessing(true);
        setMlFeedback(`Initializing ML Engine: ${taskName}...`);
        setTimeout(() => {
            setMlFeedback(`Training linear regression models...`);
            setTimeout(() => {
                setMlProcessing(false);
                setMlFeedback("");
                alert(`Machine Learning Task Complete: ${taskName} successfully executed via AI.`);
            }, 1500);
        }, 1000);
    };

    const handleAddProperty = (e) => {
        e.preventDefault();
        const propertyData = {
            ...newProperty,
            id: 'user_' + Date.now(),
            price: Number(newProperty.price),
            bedrooms: Number(newProperty.bedrooms),
            sqft: Number(newProperty.sqft),
            status: 'Active',
            views: 0, saves: 0, inquiries: 0,
            amenities: newProperty.features.split(',').map(f => f.trim())
        };
        const updated = [propertyData, ...localProperties];
        setLocalProperties(updated);
        localStorage.setItem('userProperties', JSON.stringify(updated));
        setIsAddModalOpen(false);
        setNewProperty({ name: '', locality: '', city: selectedCity, price: '', bedrooms: '', sqft: '', description: '', image: '', features: '' });
        showNotification('Property listed successfully on HomieNest!', 'success');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setNewProperty({ ...newProperty, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteProperty = (propertyId, propertyName) => {
        if (!propertyId.toString().startsWith('user_')) {
            showNotification("System properties cannot be deleted. You can only delete properties you manually added.", "error");
            return;
        }
        if (confirm(`Are you sure you want to delete "${propertyName}"? This action cannot be undone.`)) {
            const updated = localProperties.filter(p => p.id !== propertyId);
            setLocalProperties(updated);
            localStorage.setItem('userProperties', JSON.stringify(updated));
            showNotification('Property removed from your portfolio.', 'success');
        }
    };

    // Filter properties by selected city
    const allCityProperties = [...localProperties, ...properties].filter(p => selectedCity === 'All' || p.city === selectedCity);
    const myListings = allCityProperties.slice(0, 8).map((p, i) => ({
        ...p,
        status: p.status === 'sold' ? 'Sold' : p.status === 'pending' ? 'Negotiation' : p.status || 'Active',
        views: p.views || 1240 + i * 250,
        saves: p.saves || 85 + i * 12,
        inquiries: p.inquiries || 12 + i * 3
    }));

    const tabs = [
        { id: 'listings', label: 'My Listings', icon: 'home_work' },
        { id: 'pricing', label: 'AI Pricing', icon: 'auto_graph', highlight: true },
        { id: 'ai', label: 'AI Insights', icon: 'psychology' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'listings':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold font-['Anton'] uppercase tracking-wider">Property Portfolio</h2>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">{myListings.length} Listings</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer hover:bg-white/10 transition-all"
                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
                                >
                                    <option value="All" className="bg-black text-white">ALL CITIES</option>
                                    {cities.map(c => (
                                        <option key={c} value={c} className="bg-black text-white">{c}</option>
                                    ))}
                                </select>
                                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
                                    <Plus size={16} />
                                    Add New
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {myListings.map((property) => (
                                <div key={property.id} className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:border-primary/30 transition-all duration-300">
                                    <div className="aspect-[16/10] relative overflow-hidden">
                                        <img src={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={property.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border",
                                                property.status === 'Active' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                                                    property.status === 'Negotiation' ? "bg-amber-500/20 text-amber-400 border-amber-500/20" :
                                                        "bg-white/10 text-white/60 border-white/10"
                                            )}>
                                                {property.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-white mb-0.5 truncate">{property.name}</h3>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">{property.locality} · {property.bedrooms} BHK · {property.sqft} sqft</p>
                                        <p className="text-primary font-bold text-xl mb-4">{formatPrice(property.price)}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingProperty(property)} title="Edit Listing" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer">
                                                    <Edit size={14} />
                                                </button>
                                                <button onClick={() => setPreviewProperty(property)} title="Preview Listing" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer">
                                                    <ExternalLink size={14} />
                                                </button>
                                                <button onClick={() => { navigator.clipboard.writeText(`${property.name} — ${formatPrice(property.price)} | ${property.bedrooms} BHK, ${property.sqft} sqft in ${property.city}`); showNotification('Listing details copied to clipboard!', 'success'); }} title="Copy Listing" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                            <button onClick={() => handleDeleteProperty(property.id, property.name)} title="Delete" className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'pricing':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-['Anton'] text-white tracking-wide uppercase mb-2">AI Pricing Assistant</h2>
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Strategy for Palm Grove Estate</p>
                                    </div>
                                    <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">High Demand Level</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Current Price</span>
                                        <div className="text-3xl font-['Anton'] text-white">₹2.45 Cr</div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 relative group cursor-pointer hover:bg-primary/20 transition-all">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 block">AI Suggested Price</span>
                                        <div className="text-3xl font-['Anton'] text-white flex items-center gap-3">
                                            ₹2.62 Cr
                                            <ArrowUpRight className="text-emerald-400 animate-bounce" size={24} />
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                            <Check size={12} /> Possible 7% Upside
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                                        <span>Market Minimum</span>
                                        <span>Avg. Market</span>
                                        <span>Market Maximum</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-white/10 w-1/4 border-r border-white/5" />
                                        <div className="h-full bg-primary/40 w-1/2 relative">
                                            <div className="absolute top-0 left-1/2 w-1 h-full bg-white shadow-[0_0_15px_white]" />
                                        </div>
                                        <div className="h-full bg-white/10 w-1/4 border-l border-white/5" />
                                    </div>
                                    <p className="text-xs text-white/60 leading-relaxed italic">
                                        "Your property is currently priced in the 45th percentile. Given the recent infrastructure development in Indiranagar, we recommend adjusting to the 60th percentile for optimal returns without losing traction."
                                    </p>
                                </div>

                                <button onClick={() => { setPriceAdjusted(true); showNotification("Applied AI Suggested Price Adjustment to Palm Grove Estate!", "success"); }} className="w-full mt-8 bg-white text-black hover:bg-white/90 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-2 cursor-pointer">
                                    {priceAdjusted ? 'Price Adjusted to ₹2.62 Cr ✓' : 'Apply Suggested Price Adjustment'}
                                    <Zap size={14} className="fill-black" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <StatCard label="Price vs Market" value="-4.2%" trend="+1.2" icon="compare_arrows" />
                            <StatCard label="Neighborhood Growth" value="+12.4%" trend="+2.4" icon="trending_up" color="#10b981" />
                            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Market Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/40">Buyer Interest</span>
                                        <span className="text-xs font-bold text-emerald-400">Very High</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/40">Avg. Listing Life</span>
                                        <span className="text-xs font-bold text-white">18 Days</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/40">Similar Listings</span>
                                        <span className="text-xs font-bold text-white">24</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'leads':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold font-['Anton'] uppercase tracking-wider">Interested Buyers</h2>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">3 New Today</span>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-white/40">Buyer Identity</th>
                                        <th className="px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-white/40">Interest Level</th>
                                        <th className="px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-white/40">Status</th>
                                        <th className="px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-white/40">Last Action</th>
                                        <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { name: 'Rahul Sharma', email: 'rahul.s@example.com', type: 'High Interest', stage: 'Visit Scheduled', last: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
                                        { name: 'Ananya Iyer', email: 'ananya.i@example.com', type: 'Direct Offer', stage: 'Negotiating', last: '5h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya' },
                                        { name: 'Vikram Malhotra', email: 'v.malhotra@example.com', type: 'Casual', stage: 'Contacted', last: '1d ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' }
                                    ].map((lead, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <img src={lead.avatar} className="w-10 h-10 rounded-full bg-white/10 border border-white/10" alt="" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white">{lead.name}</span>
                                                        <span className="text-[10px] text-white/40">{lead.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-xs text-white/60">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full font-bold",
                                                    lead.type === 'Direct Offer' ? "text-primary bg-primary/10" : "text-emerald-400 bg-emerald-400/10"
                                                )}>{lead.type}</span>
                                            </td>
                                            <td className="px-6 py-6 text-xs font-medium text-white/80">{lead.stage}</td>
                                            <td className="px-6 py-6 text-[10px] text-white/40 font-bold uppercase tracking-widest">{lead.last}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setLeadActionModal({ lead, type: 'Call' })} className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 transition-all cursor-pointer">
                                                        <Phone size={14} />
                                                    </button>
                                                    <button onClick={() => setLeadActionModal({ lead, type: 'Message' })} className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/40 hover:text-primary transition-all cursor-pointer">
                                                        <MessageSquare size={14} />
                                                    </button>
                                                    <button onClick={() => setLeadActionModal({ lead, type: 'Visit Schedule' })} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer">
                                                        <Calendar size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );

            case 'performance':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard label="Impressions" value="48.2K" trend="+15" icon="visibility" />
                            <StatCard label="Unique Views" value="12,405" trend="+8" icon="person" />
                            <StatCard label="Property Saves" value="842" trend="+24" icon="favorite" color="#ec4899" />
                            <StatCard label="Conversion" value="3.2%" trend="-2" icon="ads_click" color="#8b5cf6" />
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 h-[400px]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-['Anton'] text-white tracking-wide uppercase">Visibility Growth</h3>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Impressions</div>
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white/20" /> Benchmark</div>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="80%">
                                <AreaChart data={cityData['mumbai']}>
                                    <defs>
                                        <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={3} fillOpacity={1} fill="url(#colorImpressions)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                );

            case 'documents':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Ownership Deed', status: 'Verified', date: 'Oct 2025', icon: 'verified_user' },
                                { title: 'Tax Receipts', status: 'Updated', date: 'Jan 2026', icon: 'receipt_long' },
                                { title: 'RERA Approvals', status: 'Pending', date: 'Processing', icon: 'gavel' }
                            ].map((doc, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white/40">{doc.icon}</span>
                                        </div>
                                        <button className="text-white/20 hover:text-white transition-colors">
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{doc.title}</h4>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full",
                                            doc.status === 'Verified' ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary"
                                        )}>{doc.status}</span>
                                        <span className="text-[10px] text-white/20">{doc.date}</span>
                                    </div>
                                    <button onClick={() => setDocModal(doc)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 group-hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white cursor-pointer">
                                        <Upload size={14} /> Update Document
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'visits':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={16} className="text-primary" /> Upcoming Visits
                            </h3>
                            {[
                                { time: 'Today, 4:00 PM', buyer: 'Arjun Mehra', status: 'Confirmed' },
                                { time: 'Tomorrow, 10:30 AM', buyer: 'Saira Kapoor', status: 'Pending' }
                            ].map((v, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">{v.time}</span>
                                        <span className="text-xs text-white/40">{v.buyer}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500/30 transition-all">Reschedule</button>
                                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={16} className="text-primary" /> Active Offers
                            </h3>
                            {[
                                { offer: '₹2.58 Cr', buyer: 'Amit Verma', note: 'Ready Possession', status: 'New' },
                            ].map((v, i) => (
                                <div key={i} className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-['Anton'] text-white">{v.offer}</span>
                                            <span className="text-xs text-white/40">From {v.buyer}</span>
                                        </div>
                                        <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_4px_12px_rgba(201,58,42,0.3)]">{v.status}</span>
                                    </div>
                                    <p className="text-xs text-white/60 mb-6 bg-black/20 p-3 rounded-xl italic">"{v.note}"</p>
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/90">Accept Offer</button>
                                        <button className="px-4 py-3 bg-white/5 border border-white/10 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10">Counter</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'promotion':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[2.5rem] p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-['Anton'] text-white tracking-wide uppercase mb-4">Boost Listing</h3>
                                <p className="text-xs text-white/40 leading-relaxed mb-8 uppercase tracking-widest font-bold">Get 10x more reach using our "Priority Plus" boosting engine. Your property will appear first in all relevant searches for 7 days.</p>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Smart Retargeting</div>
                                    <div className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Social Media Showcase</div>
                                    <div className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Premium Badge Highlight</div>
                                </div>
                            </div>
                            <button onClick={() => { setBoostActive(true); showNotification("Priority Plus Boost Activated for 7 days!", "success"); }} className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-[0_8px_32px_rgba(201,58,42,0.3)] cursor-pointer">
                                {boostActive ? 'Priority Boost Active ✓' : 'Activate Boost — ₹9,999'}
                            </button>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-['Anton'] text-white tracking-wide uppercase mb-6">Agent Assistance</h3>
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-bold mb-8">Professional help to close deals faster</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-all">
                                    <Camera size={24} className="mx-auto mb-3 text-primary" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest block">Pro Photos</span>
                                </button>
                                <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-all">
                                    <FileText size={24} className="mx-auto mb-3 text-primary" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest block">Legal Audit</span>
                                </button>
                                <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-all">
                                    <Users size={24} className="mx-auto mb-3 text-primary" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest block">Concierge</span>
                                </button>
                                <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-all">
                                    <Target size={24} className="mx-auto mb-3 text-primary" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest block">Valuation</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'ai':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="bg-black/40 backdrop-blur-xl border border-primary/20 rounded-[2.5rem] p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(201,58,42,0.4)]">
                                    <Brain className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-['Anton'] text-white tracking-wide uppercase">AI Insight Engine</h3>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Smart Recommendations for Faster Sales</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Camera size={18} className="text-primary" />
                                            <span className="text-sm font-bold text-white uppercase tracking-wider">Visual Enhancement</span>
                                        </div>
                                        <p className="text-xs text-white/40 leading-relaxed mb-4">"Our computer vision model detected low lighting in your bedroom photos. Brighter imagery can increase click-through rates by 22%."</p>
                                        <button className="text-[9px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">Book Pro Photography <ChevronRight size={12} /></button>
                                    </div>
                                    <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Target size={18} className="text-primary" />
                                            <span className="text-sm font-bold text-white uppercase tracking-wider">Price Correction</span>
                                        </div>
                                        <p className="text-xs text-white/40 leading-relaxed mb-4">"Inventory in HSR Layout has increased by 15% this week. A minor 2% drop could position you as the top-value listing."</p>
                                        <button className="text-[9px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">View Data Model <ChevronRight size={12} /></button>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-8 bg-primary/10 border border-primary/20 rounded-3xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h4 className="text-3xl font-['Anton'] text-white mb-2">12 Days</h4>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Predicted Time to Sell</p>
                                            <p className="text-xs text-white/80 leading-relaxed">Based on current market velocity and your listing's performance metrics, we expect a firm offer within the next 2 weeks.</p>
                                        </div>
                                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary opacity-10 blur-3xl rounded-full" />
                                    </div>
                                    <button onClick={() => executeMLTask("Linear Regression Sequence Analytics")} className="w-full py-4 border border-white/10 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] text-white/40 hover:bg-white/5 hover:text-white transition-all">Refresh Predictions</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return <EmptyState title="Coming Soon" subtitle="This section is currently being integrated." icon="construction" />;
        }
    };

    return (
        <AuthGuard>
            <div className="relative min-h-screen text-white bg-[#030303] selection:bg-primary/30 selection:text-white pb-32">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <BackgroundPaths title="" showCta={false} />
                </div>

                <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-32">

                    <SectionHeader
                        icon="sell"
                        title="Seller Portal"
                        subtitle="Command Center for Homeowners"
                        accent={ACCENT}
                    />

                    <div className="mb-10 lg:sticky lg:top-24 z-40">
                        <TabBar
                            tabs={tabs}
                            active={activeTab}
                            onChange={setActiveTab}
                            accent={ACCENT}
                        />
                    </div>

                    <div className="relative min-h-[60vh]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Quick Stats Grid - Secondary performance metrics */}
                    <div className="mt-20 pt-10 border-t border-white/5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 hover:opacity-100 transition-opacity">
                            <div className="text-center">
                                <div className="text-2xl font-['Anton'] text-white">4.9/5</div>
                                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Listing Quality</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-['Anton'] text-white">92%</div>
                                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Response Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-['Anton'] text-white">₹24 Cr</div>
                                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Portfolio Value</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-['Anton'] text-white">PRO</div>
                                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Seller Status</div>
                            </div>
                        </div>
                    </div>
            </div>
            {/* Add New Property Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl shadow-primary/20 relative"
                        >
                            <div className="sticky top-0 bg-[#111] z-10 flex justify-between items-center p-6 border-b border-white/10">
                                <div>
                                    <h2 className="text-2xl font-bold font-['Anton'] uppercase tracking-wider text-white">Post New Property</h2>
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">List your property like OLX to reach thousands of buyers</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAddProperty} className="p-6 space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Property Photos</label>
                                    <div className="relative border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group overflow-hidden">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" required />
                                        {newProperty.image ? (
                                            <img src={newProperty.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <>
                                                <Upload size={32} className="text-primary mb-3 group-hover:-translate-y-1 transition-transform" />
                                                <span className="text-sm font-bold text-white mb-1">Click or drag to upload</span>
                                                <span className="text-xs text-white/40">High quality photos attract 3x more buyers</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Property Title</label>
                                        <input type="text" required placeholder="e.g. Modern 3BHK in Hiranandani" value={newProperty.name} onChange={e => setNewProperty({...newProperty, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-white/20" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Asking Price (₹)</label>
                                        <input type="number" required placeholder="e.g. 15000000" value={newProperty.price} onChange={e => setNewProperty({...newProperty, price: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-white/20" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">City</label>
                                        <select value={newProperty.city} onChange={e => setNewProperty({...newProperty, city: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 appearance-none">
                                            {allIndianCities.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Locality / Area</label>
                                        <input type="text" required placeholder="e.g. Powai" value={newProperty.locality} onChange={e => setNewProperty({...newProperty, locality: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-white/20" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Bedrooms (BHK)</label>
                                        <input type="number" required placeholder="e.g. 3" value={newProperty.bedrooms} onChange={e => setNewProperty({...newProperty, bedrooms: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-white/20" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Super Built-up Area (Sqft)</label>
                                        <input type="number" required placeholder="e.g. 1500" value={newProperty.sqft} onChange={e => setNewProperty({...newProperty, sqft: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-white/20" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Features / Amenities (Comma Separated)</label>
                                    <input type="text" placeholder="e.g. Pool, Gym, 24x7 Security, Parking" value={newProperty.features} onChange={e => setNewProperty({...newProperty, features: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-white/20" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Description</label>
                                    <textarea required rows={4} placeholder="Describe your property, nearby landmarks, facing, etc." value={newProperty.description} onChange={e => setNewProperty({...newProperty, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-white/20 resize-none" />
                                </div>

                                <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
                                    <button type="submit" className="px-8 py-3 rounded-xl bg-primary hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                        <Upload size={16} /> Post Listing
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#111] border border-white/10 shadow-2xl shadow-primary/20"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {notification.type === 'success' ? <Check size={16} /> : <Target size={16} />}
                        </div>
                        <p className="text-sm font-bold text-white tracking-wide">{notification.message}</p>
                        <button onClick={() => setNotification(null)} className="ml-2 p-1 text-white/40 hover:text-white transition-colors">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EDIT PROPERTY MODAL */}
            <AnimatePresence>
                {editingProperty && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Edit Property Listing</h3>
                                <button onClick={() => setEditingProperty(null)} className="p-2 text-white/40 hover:text-white"><X size={16} /></button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const updated = localProperties.map(p => p.id === editingProperty.id ? editingProperty : p);
                                setLocalProperties(updated);
                                localStorage.setItem('userProperties', JSON.stringify(updated));
                                setEditingProperty(null);
                                showNotification('Property listing updated successfully!', 'success');
                            }} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Title</label>
                                    <input type="text" value={editingProperty.name} onChange={e => setEditingProperty({ ...editingProperty, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Price (₹)</label>
                                        <input type="number" value={editingProperty.price} onChange={e => setEditingProperty({ ...editingProperty, price: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Area (sqft)</label>
                                        <input type="number" value={editingProperty.sqft} onChange={e => setEditingProperty({ ...editingProperty, sqft: +e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" required />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                    <button type="button" onClick={() => setEditingProperty(null)} className="px-5 py-2.5 rounded-xl bg-white/5 text-white/50 hover:text-white text-xs font-bold uppercase">Cancel</button>
                                    <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase shadow-lg shadow-primary/20">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PREVIEW DRAWER */}
            <AnimatePresence>
                {previewProperty && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-md bg-[#0f0f12] border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Listing Live Preview</span>
                                <button onClick={() => setPreviewProperty(null)} className="p-1 text-white/40 hover:text-white"><X size={16} /></button>
                            </div>
                            <div className="h-48 rounded-2xl overflow-hidden bg-slate-800 relative mb-4">
                                <img src={previewProperty.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600"} className="w-full h-full object-cover" alt="" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{previewProperty.name}</h3>
                            <p className="text-xs text-white/40 mb-3">{previewProperty.locality}, {previewProperty.city}</p>
                            <div className="text-2xl font-['Anton'] text-primary mb-4">{formatPrice(previewProperty.price)}</div>
                            <button onClick={() => setPreviewProperty(null)} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest">Close Preview</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* LEAD ACTION MODAL */}
            <AnimatePresence>
                {leadActionModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
                                {leadActionModal.type === 'Call' ? <Phone size={20} /> : leadActionModal.type === 'Message' ? <MessageSquare size={20} /> : <Calendar size={20} />}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{leadActionModal.type} {leadActionModal.lead.name}</h3>
                            <p className="text-xs text-white/50 mb-6">Connecting via HomieNest Partner Relay ({leadActionModal.lead.email})</p>
                            <button onClick={() => { showNotification(`${leadActionModal.type} request dispatched to ${leadActionModal.lead.name}`, 'success'); setLeadActionModal(null); }} className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
                                Confirm {leadActionModal.type}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DOCUMENT UPLOAD MODAL */}
            <AnimatePresence>
                {docModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">Upload {docModal.title}</h3>
                                <button onClick={() => setDocModal(null)} className="p-1 text-white/40 hover:text-white"><X size={16} /></button>
                            </div>
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer mb-6" onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.onchange = () => {
                                    showNotification(`${docModal.title} uploaded successfully! Verification pending.`, 'success');
                                    setDocModal(null);
                                };
                                input.click();
                            }}>
                                <Upload size={32} className="mx-auto text-primary mb-2" />
                                <p className="text-xs font-bold text-white mb-1">Click to select PDF or image file</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest">Max size 20MB</p>
                            </div>
                            <button onClick={() => setDocModal(null)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl">Cancel</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
        </AuthGuard>
    );
}

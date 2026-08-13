"use client";
import React, { useState, useEffect, useMemo } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { SectionHeader, StatCard, TabBar } from '@/components/ui/RoleTheme';
import { properties, formatPrice } from '@/lib/mockData';
import { 
    ShieldAlert, Users, Database, Activity, RefreshCw, CheckCircle, 
    Trash2, Star, Search, Download, Server, Cpu, Lock, Unlock, Play 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#ef4444';

// Initial Mock Users for Admin Management
const initialAdminUsers = [
    { id: 'usr_1', name: 'Trishank B', email: 'saitrishankb9@gmail.com', role: 'admin', status: 'Active', created: '2025-10-12', logins: 142 },
    { id: 'usr_2', name: 'Rahul Sharma', email: 'rahul.s@example.com', role: 'buyer', status: 'Active', created: '2025-11-04', logins: 28 },
    { id: 'usr_3', name: 'Ananya Iyer', email: 'ananya.i@example.com', role: 'seller', status: 'Active', created: '2025-11-19', logins: 19 },
    { id: 'usr_4', name: 'Arjun Reddy', email: 'arjun.reddy@realty.com', role: 'agent', status: 'Active', created: '2025-09-01', logins: 310 },
    { id: 'usr_5', name: 'Vikram Malhotra', email: 'v.malhotra@example.com', role: 'buyer', status: 'Suspended', created: '2026-01-05', logins: 4 },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [usersList, setUsersList] = useState(initialAdminUsers);
    const [userSearch, setUserSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [localProps, setLocalProps] = useState([]);
    
    // AI Model System State
    const [modelStatus, setModelStatus] = useState({
        accuracy: 98.4,
        latency: 142,
        samplesProcessed: 1245890,
        lastTrained: 'Today, 04:30 AM',
        isRetraining: false
    });

    // Toast Feedback
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Sync properties with localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedProps = localStorage.getItem('userProperties');
            if (savedProps) {
                try { setLocalProps(JSON.parse(savedProps)); } catch (e) {}
            }
        }
    }, []);

    const allListings = useMemo(() => [...localProps, ...properties], [localProps]);

    // Admin Handlers
    const handleRoleChange = (userId, newRole) => {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showToast(`User role updated to ${newRole.toUpperCase()}`);
    };

    const handleToggleStatus = (userId) => {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
        showToast(`User account status toggled`);
    };

    const handleDeleteUser = (userId, name) => {
        if (confirm(`Remove user "${name}" from platform?`)) {
            setUsersList(prev => prev.filter(u => u.id !== userId));
            showToast(`User ${name} deleted`, 'error');
        }
    };

    const handleDeleteProperty = (propertyId) => {
        if (confirm('Delete this listing from HomieNest database?')) {
            const updated = localProps.filter(p => p.id !== propertyId);
            setLocalProps(updated);
            localStorage.setItem('userProperties', JSON.stringify(updated));
            showToast('Property listing removed', 'error');
        }
    };

    const handleTriggerRetrain = () => {
        setModelStatus(prev => ({ ...prev, isRetraining: true }));
        showToast('Initiating ML Model Retraining Pipeline...');
        setTimeout(() => {
            setModelStatus({
                accuracy: 99.1,
                latency: 118,
                samplesProcessed: 1258400,
                lastTrained: 'Just now',
                isRetraining: false
            });
            showToast('AI Model successfully retrained & deployed!');
        }, 2500);
    };

    const handleClearSystemCache = () => {
        showToast('System cache flushed and index rebuilt.');
    };

    const handleExportAuditLogs = () => {
        const logContent = `HomieNest Audit Log Export - ${new Date().toISOString()}\nTotal Users: ${usersList.length}\nTotal Properties: ${allListings.length}\nSystem Health: OPTIMAL`;
        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `homienest-audit-${Date.now()}.txt`;
        a.click();
        showToast('Audit log downloaded');
    };

    const filteredUsers = usersList.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'dashboard' },
        { id: 'users', label: 'Users', icon: 'group', badge: usersList.length },
        { id: 'listings', label: 'Listings', icon: 'home_work', badge: allListings.length },
        { id: 'ai_engine', label: 'AI Engine', icon: 'psychology' },
        { id: 'system', label: 'System Tools', icon: 'tune' }
    ];

    return (
        <AuthGuard>
            <div className="relative min-h-screen text-white bg-[#030303] selection:bg-red-500/30">
                <div className="absolute inset-0 z-0">
                    <BackgroundPaths title="" showCta={false} />
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl border backdrop-blur-xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 shadow-2xl ${toast.type === 'error' ? 'bg-red-600/20 border-red-500/30 text-red-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'}`}
                        >
                            <CheckCircle size={16} />
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
                    <SectionHeader
                        icon="shield"
                        title="Admin Command Center"
                        subtitle="System Administration • User Governance • AI Engine Telemetry"
                        accent={ACCENT}
                    />

                    <div className="mb-10">
                        <TabBar
                            tabs={tabs}
                            active={activeTab}
                            onChange={setActiveTab}
                            accent={ACCENT}
                        />
                    </div>

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                <StatCard icon="group" label="Registered Users" value={usersList.length} trend="12" color="#3b82f6" />
                                <StatCard icon="home" label="Platform Listings" value={allListings.length} trend="5" color="#22c55e" />
                                <StatCard icon="auto_awesome" label="AI Accuracy Rate" value={`${modelStatus.accuracy}%`} color="#ef4444" />
                                <StatCard icon="dns" label="Server Telemetry" value="ONLINE" sub="Latency 142ms" color="#10b981" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                    <h3 className="text-xl font-['Anton'] text-white tracking-wide uppercase mb-6 flex items-center gap-2">
                                        <Activity size={20} className="text-red-500" />
                                        Real-Time Platform Activity
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { action: 'New User Registered', detail: 'saitrishankb9@gmail.com initialized partner privileges.', time: '2 mins ago', icon: 'person_add', color: '#3b82f6' },
                                            { action: 'Property Price Predicted', detail: '2 BHK Penthouse, Bandra West valuation calculated.', time: '8 mins ago', icon: 'auto_awesome', color: '#ef4444' },
                                            { action: 'Listing Approved', detail: 'Riverside Villa Whitefield added to marketplace.', time: '24 mins ago', icon: 'verified', color: '#22c55e' },
                                            { action: 'Site Visit Requested', detail: 'Buyer scheduled tour for Sky Loft Apartment.', time: '1 hour ago', icon: 'event', color: '#f59e0b' }
                                        ].map((act, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: `${act.color}20` }}>
                                                    <span className="material-symbols-outlined text-sm" style={{ color: act.color }}>{act.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-white">{act.action}</div>
                                                    <div className="text-[11px] text-white/50">{act.detail}</div>
                                                </div>
                                                <div className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{act.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Quick Governance</h3>
                                        <div className="space-y-3">
                                            <button onClick={handleTriggerRetrain} className="w-full flex items-center justify-between p-3.5 bg-red-600/20 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                                                <span className="flex items-center gap-2"><Cpu size={16} /> Retrain ML Engine</span>
                                                <Play size={12} />
                                            </button>
                                            <button onClick={handleClearSystemCache} className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                                                <span className="flex items-center gap-2"><RefreshCw size={16} /> Flush Cache</span>
                                                <CheckCircle size={12} />
                                            </button>
                                            <button onClick={handleExportAuditLogs} className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                                                <span className="flex items-center gap-2"><Download size={16} /> Export Audit Log</span>
                                                <Download size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS MANAGEMENT TAB */}
                    {activeTab === 'users' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                                    <Search size={18} className="text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={userSearch}
                                        onChange={e => setUserSearch(e.target.value)}
                                        className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/30"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Filter Role:</span>
                                    <select
                                        value={roleFilter}
                                        onChange={e => setRoleFilter(e.target.value)}
                                        className="bg-black border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                                    >
                                        <option value="all">ALL ROLES</option>
                                        <option value="buyer">BUYER</option>
                                        <option value="seller">SELLER</option>
                                        <option value="agent">AGENT</option>
                                        <option value="admin">ADMIN</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                                <th className="px-6 py-5 font-bold uppercase tracking-widest text-white/40">User</th>
                                                <th className="px-6 py-5 font-bold uppercase tracking-widest text-white/40">Role</th>
                                                <th className="px-6 py-5 font-bold uppercase tracking-widest text-white/40">Status</th>
                                                <th className="px-6 py-5 font-bold uppercase tracking-widest text-white/40">Joined</th>
                                                <th className="px-6 py-5 font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredUsers.map(user => (
                                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-white text-sm">{user.name}</div>
                                                        <div className="text-[10px] text-white/40">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={user.role}
                                                            onChange={e => handleRoleChange(user.id, e.target.value)}
                                                            className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase text-white cursor-pointer"
                                                        >
                                                            <option value="buyer">Buyer</option>
                                                            <option value="seller">Seller</option>
                                                            <option value="agent">Agent</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-white/40">{user.created}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleToggleStatus(user.id)}
                                                                title={user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
                                                            >
                                                                {user.status === 'Active' ? <Lock size={14} /> : <Unlock size={14} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                                title="Delete User"
                                                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LISTINGS MANAGEMENT TAB */}
                    {activeTab === 'listings' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {allListings.map(property => (
                                    <div key={property.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="h-32 rounded-xl bg-slate-800 relative overflow-hidden mb-3">
                                                <img src={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400"} className="w-full h-full object-cover" alt="" />
                                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-black/60 text-white backdrop-blur-sm">
                                                    {property.city}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-white text-sm truncate">{property.name}</h4>
                                            <p className="text-[11px] text-white/40 mb-2">{property.locality} • {property.bedrooms} BHK</p>
                                            <div className="text-primary font-bold text-base">{formatPrice(property.price)}</div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                                            <button
                                                onClick={() => handleDeleteProperty(property.id)}
                                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-bold uppercase transition-all"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI ENGINE TAB */}
                    {activeTab === 'ai_engine' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                                    <div>
                                        <h3 className="text-2xl font-['Anton'] text-white uppercase tracking-wide">Deep Learning Pricing Model</h3>
                                        <p className="text-xs text-white/40">Multi-factor valuation network powered by PyTorch / NIM architecture.</p>
                                    </div>
                                    <button
                                        onClick={handleTriggerRetrain}
                                        disabled={modelStatus.isRetraining}
                                        className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 cursor-pointer"
                                    >
                                        <Cpu size={16} />
                                        {modelStatus.isRetraining ? 'Retraining...' : 'Trigger Model Retrain'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="text-2xl font-bold text-white">{modelStatus.accuracy}%</div>
                                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Valuation Accuracy</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="text-2xl font-bold text-white">{modelStatus.latency} ms</div>
                                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Inference Latency</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="text-2xl font-bold text-white">{(modelStatus.samplesProcessed / 1000000).toFixed(2)}M</div>
                                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Data Points Trained</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="text-xs font-bold text-emerald-400 mt-1">{modelStatus.lastTrained}</div>
                                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Last Retrained</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SYSTEM TOOLS TAB */}
                    {activeTab === 'system' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                <h3 className="text-xl font-['Anton'] text-white uppercase tracking-wide mb-4">Database & Cache</h3>
                                <p className="text-xs text-white/50 mb-6">Perform routine maintenance on search indices and real-time database nodes.</p>
                                <div className="space-y-4">
                                    <button onClick={handleClearSystemCache} className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                        Flush Redis Cache
                                    </button>
                                    <button onClick={() => showToast('Database index optimized!')} className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                        Optimize Search Indices
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                                <h3 className="text-xl font-['Anton'] text-white uppercase tracking-wide mb-4">Audit & Security Logs</h3>
                                <p className="text-xs text-white/50 mb-6">Download platform activity trace logs for security compliance audits.</p>
                                <button onClick={handleExportAuditLogs} className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2">
                                    <Download size={16} /> Download Full System Log
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}

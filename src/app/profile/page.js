"use client";

import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { SectionHeader, StatCard, TabBar, FieldGroup, ActionButton } from '@/components/ui/RoleTheme';
import { activityTimeline, properties } from '@/lib/mockData';
import { User, Phone, Mail, Building, FileCheck, Shield, Bell, Heart, History, Settings, CheckCircle2, Upload, Eye, Bookmark, Gavel, Event } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#c93a2a';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        alternate_contact: '',
        company_name: '',
        rera_license: ''
    });
    const [preferences, setPreferences] = useState({
        cities: [],
        minBudget: 2,
        maxBudget: 5,
        intent: 'Self-Use',
        propertyTypes: []
    });

    const [role, setRole] = useState('buyer'); // buyer, seller, agent
    const [activeInterestTab, setActiveInterestTab] = useState('saved');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setFormData({
                        name: data.user.name || '',
                        phone: data.user.phone || '+91 98200 12345',
                        alternate_contact: data.user.alternate_contact || '',
                        company_name: data.user.company_name || 'HomieNest Elite Realty',
                        rera_license: data.user.rera_license || 'A51900000XXX'
                    });
                    setPreferences(data.user.preferences || {
                        cities: ['Mumbai', 'Bangalore', 'Gurgaon'],
                        minBudget: 2,
                        maxBudget: 5,
                        intent: 'Self-Use',
                        propertyTypes: ['Apartment', 'Villa']
                    });
                    // Role detection
                    if (data.user?.email?.includes('agent')) setRole('agent');
                    else if (data.user?.email?.includes('seller')) setRole('seller');
                    else if (data.user?.role) setRole(data.user.role);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const handleUpdateProfile = async (data = formData) => {
        setUpdating(true);
        setFeedback({ type: '', message: '' });
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setFeedback({ type: 'success', message: 'Profile updated successfully!' });
                setIsEditing(false);
            } else {
                const error = await res.json();
                setFeedback({ type: 'error', message: error.error || 'Failed to update profile' });
            }
        } catch (err) {
            setFeedback({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setUpdating(false);
            setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
        }
    };
    const handleUpdatePreferences = async (newPrefs) => {
        setPreferences(newPrefs);
        await handleUpdateProfile({ preferences: newPrefs });
    };

    const toggleCity = (city) => {
        const newCities = preferences.cities.includes(city)
            ? preferences.cities.filter(c => c !== city)
            : [...preferences.cities, city];
        handleUpdatePreferences({ ...preferences, cities: newCities });
    };

    const togglePropType = (type) => {
        const newTypes = preferences.propertyTypes.includes(type)
            ? preferences.propertyTypes.filter(t => t !== type)
            : [...preferences.propertyTypes, type];
        handleUpdatePreferences({ ...preferences, propertyTypes: newTypes });
    };

    const handleAction = (message) => {
        setFeedback({ type: 'success', message: `${message}!` });
        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    };

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) window.location.href = '/login';
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const triggerVerification = (type) => {
        handleAction(`Verification link sent to your registered ${type}`);
    };

    const handlePhotoChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleAction('Uploading new profile photo');
                // In a real app, we'd upload to Supabase/S3 and get a URL
                setTimeout(() => {
                    handleAction('Photo updated successfully');
                }, 1500);
            }
        };
        input.click();
    };

    if (!user) return null;

    const displayName = user?.name || user?.email?.split('@')[0] || "User";
    const avatarUrl = user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'guest'}`;

    return (
        <AuthGuard>
            <div className="relative min-h-screen text-white bg-[#0a0a0c]">
                <div className="absolute inset-0 z-0 opacity-40">
                    <BackgroundPaths title="" showCta={false} />
                </div>

                <div className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto">

                    {/* TOP OVERVIEW SECTION */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 md:p-8 mb-8 md:mb-12 rounded-[2rem] md:rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-[100px] -z-10 bg-primary" />

                        <div className="relative group/avatar cursor-pointer" onClick={handlePhotoChange}>
                            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 p-1 group-hover/avatar:border-primary/50 transition-colors duration-500 bg-white/5 relative">
                                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover rounded-2xl group-hover/avatar:opacity-40 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                    <Upload className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-emerald-500 border-4 border-[#0a0a0c] flex items-center justify-center shadow-lg">
                                <FileCheck className="text-white w-5 h-5" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-4xl font-['Anton'] text-white tracking-wide uppercase">{displayName}</h1>
                                <div className="flex items-center justify-center gap-2">
                                    <span
                                        onClick={() => triggerVerification(role)}
                                        className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest h-fit cursor-pointer hover:bg-emerald-500/20 transition-all"
                                    >
                                        Verified {role}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest h-fit">Partner</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                                <div className="flex items-center gap-2 text-white/40">
                                    <Mail size={14} className="text-primary" />
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/40">
                                    <Phone size={14} className="text-primary" />
                                    <span className="text-sm font-medium">+91 98XXX XXXXX</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/40">
                                    <History size={14} className="text-primary" />
                                    <span className="text-sm font-medium uppercase tracking-tighter">Member Since Oct 2025</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ActionButton
                                variant={isEditing ? 'tertiary' : 'secondary'}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </ActionButton>
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-center">Last Login: 2 hours ago</div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {feedback.message && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl border backdrop-blur-xl z-[100] text-[11px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-2xl ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-primary/10 border-primary/20 text-primary'}`}
                            >
                                {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <Shield size={16} />}
                                {feedback.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* LEFT COLUMN: PRIMARY SETTINGS */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* SECTION -> PERSONAL INFORMATION */}
                            <section>
                                <SectionHeader icon="person" title="Personal Information" subtitle="Identity & Contact Details" accent={ACCENT} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm">
                                    <FieldGroup label="Full Name">
                                        <input
                                            type="text"
                                            readOnly={!isEditing}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    </FieldGroup>
                                    <FieldGroup label="Phone Number">
                                        <input
                                            type="text"
                                            readOnly={!isEditing}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    </FieldGroup>
                                    <FieldGroup label="Email Address">
                                        <input
                                            type="email"
                                            readOnly
                                            value={user.email}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm opacity-30 cursor-not-allowed font-medium"
                                        />
                                    </FieldGroup>
                                    <FieldGroup label="Alternate Contact">
                                        <input
                                            type="text"
                                            readOnly={!isEditing}
                                            value={formData.alternate_contact}
                                            onChange={(e) => setFormData({ ...formData, alternate_contact: e.target.value })}
                                            placeholder="Secondary phone or email"
                                            className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    </FieldGroup>
                                    {role === 'agent' && (
                                        <>
                                            <FieldGroup label="Company Name">
                                                <input
                                                    type="text"
                                                    readOnly={!isEditing}
                                                    value={formData.company_name}
                                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                    className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                />
                                            </FieldGroup>
                                            <FieldGroup label="RERA / License Number">
                                                <input
                                                    type="text"
                                                    readOnly={!isEditing}
                                                    value={formData.rera_license}
                                                    onChange={(e) => setFormData({ ...formData, rera_license: e.target.value })}
                                                    className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                />
                                            </FieldGroup>
                                        </>
                                    )}
                                    <div className="md:col-span-2 flex justify-end mt-4">
                                        <ActionButton
                                            disabled={!isEditing || updating}
                                            onClick={() => handleUpdateProfile()}
                                        >
                                            {updating ? 'Saving...' : 'Save Changes'}
                                        </ActionButton>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION -> ROLE-BASED MODULES */}
                            <section>
                                <SectionHeader
                                    icon={role === 'buyer' ? 'home' : role === 'seller' ? 'sell' : 'handshake'}
                                    title={`${role.toUpperCase()} CENTER`}
                                    subtitle="Managed Operations & Assets"
                                    accent={ACCENT}
                                />
                                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] -z-10" />

                                    {role === 'buyer' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div
                                                onClick={() => handleAction('Opening Saved Homes')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group/card"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Saved Homes</div>
                                                <div className="text-2xl font-['Anton'] text-white">12 Units</div>
                                                <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1"><Eye size={10} /> 2 Price Drops</div>
                                            </div>
                                            <div
                                                onClick={() => handleAction('Reviewing Tour History')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Tour History</div>
                                                <div className="text-2xl font-['Anton'] text-white">8 Visits</div>
                                                <div className="text-[10px] text-white/40 mt-2">Next: 22 Feb</div>
                                            </div>
                                            <div
                                                onClick={() => handleAction('Calculating Affordability')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Affordability</div>
                                                <div className="text-2xl font-['Anton'] text-white">₹ 4.5 Cr</div>
                                                <div className="text-[10px] text-white/40 mt-2">Loan Pre-Approved</div>
                                            </div>
                                        </div>
                                    )}

                                    {role === 'seller' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div
                                                onClick={() => handleAction('Managing Listings')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">My Listings</div>
                                                <div className="text-2xl font-['Anton'] text-white">2 Live</div>
                                                <div className="text-[10px] text-emerald-400 mt-2">450+ Views</div>
                                            </div>
                                            <div
                                                onClick={() => handleAction('Viewing Active Leads')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Active Leads</div>
                                                <div className="text-2xl font-['Anton'] text-white">15 Inquiries</div>
                                                <div className="text-[10px] text-white/40 mt-2">3 Hot Prospects</div>
                                            </div>
                                            <div
                                                onClick={() => handleAction('Analyzing Performance')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Performance</div>
                                                <div className="text-2xl font-['Anton'] text-white">94/100</div>
                                                <div className="text-[10px] text-white/40 mt-2">Listing Quality</div>
                                            </div>
                                        </div>
                                    )}

                                    {role === 'agent' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div
                                                onClick={() => handleAction('Managing Client Base')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">My Clients</div>
                                                <div className="text-2xl font-['Anton'] text-white">24 Active</div>
                                                <div className="text-[10px] text-emerald-400 mt-2">5 Closures this month</div>
                                            </div>
                                            <div
                                                onClick={() => handleAction('Tracking Active Deals')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Active Deals</div>
                                                <div className="text-2xl font-['Anton'] text-white">₹ 18.2 Cr</div>
                                                <div className="text-[10px] text-white/40 mt-2">Pipeline Value</div>
                                            </div>
                                            <div
                                                onClick={() => handleAction('Proprietary Assignments')}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Assignments</div>
                                                <div className="text-2xl font-['Anton'] text-white">8 Properties</div>
                                                <div className="text-[10px] text-white/40 mt-2">Exclusive Managed</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end mt-8">
                                        <ActionButton
                                            variant="secondary"
                                            onClick={() => handleAction(`Managing all ${role} operations`)}
                                        >
                                            Manage All
                                        </ActionButton>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION -> PREFERENCES */}
                            <section>
                                <SectionHeader icon="tune" title="Preferences" subtitle="Tailor Your Experience" accent={ACCENT} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm">
                                    <FieldGroup label="Preferred Cities">
                                        <div className="flex flex-wrap gap-2 py-2">
                                            {preferences.cities.map(city => (
                                                <span key={city} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                    {city} <X size={10} className="cursor-pointer hover:text-white" onClick={() => toggleCity(city)} />
                                                </span>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const city = prompt("Enter city name:");
                                                    if (city) toggleCity(city);
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                + Add City
                                            </button>
                                        </div>
                                    </FieldGroup>
                                    <FieldGroup label="Budget Range (Cr)">
                                        <div className="flex items-center gap-4 py-2">
                                            <input
                                                type="number"
                                                value={preferences.minBudget}
                                                onChange={(e) => setPreferences({ ...preferences, minBudget: e.target.value })}
                                                className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                                            />
                                            <span className="text-white/20">to</span>
                                            <input
                                                type="number"
                                                value={preferences.maxBudget}
                                                onChange={(e) => setPreferences({ ...preferences, maxBudget: e.target.value })}
                                                className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                                            />
                                        </div>
                                    </FieldGroup>
                                    <FieldGroup label="Investment Intent">
                                        <div className="flex gap-4 py-2">
                                            {['Self-Use', 'Investment'].map(intent => (
                                                <button
                                                    key={intent}
                                                    onClick={() => handleUpdatePreferences({ ...preferences, intent })}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${preferences.intent === intent ? 'bg-primary/20 border-primary/40 text-white font-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                                                >
                                                    {intent}
                                                </button>
                                            ))}
                                        </div>
                                    </FieldGroup>
                                    <FieldGroup label="Property Type Focus">
                                        <div className="flex flex-wrap gap-2 py-2">
                                            {['Apartment', 'Villa', 'Plot', 'Commercial'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => togglePropType(type)}
                                                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${preferences.propertyTypes.includes(type) ? 'bg-primary/10 border-primary/30 text-primary font-black' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </FieldGroup>
                                    <div className="md:col-span-2 flex justify-end">
                                        <ActionButton
                                            disabled={updating}
                                            onClick={() => handleUpdatePreferences(preferences)}
                                        >
                                            {updating ? 'Updating...' : 'Update Preferences'}
                                        </ActionButton>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION -> ACTIVITY / JOURNEY */}
                            <section>
                                <SectionHeader icon="history" title="Activity Journey" subtitle="Your Real Estate Timeline" accent={ACCENT} />
                                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm">
                                    <div className="space-y-8 relative">
                                        <div className="absolute left-[23px] top-4 bottom-4 w-px bg-white/5" />
                                        {activityTimeline.slice(0, 5).map((activity, i) => (
                                            <div key={i} className="flex items-start gap-6 group relative">
                                                <div className="w-12 h-12 rounded-2xl bg-[#0a0a0c] border border-white/10 flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 duration-300">
                                                    <span className="material-symbols-outlined text-white/40 text-xl group-hover:text-primary transition-colors">{activity.icon}</span>
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{activity.action}</h4>
                                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{activity.time}</span>
                                                    </div>
                                                    <p className="text-xs text-white/40">{activity.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center mt-12 pt-8 border-t border-white/5">
                                        <ActionButton variant="tertiary">View Full History</ActionButton>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN: UTILITIES & SECURITY */}
                        <div className="lg:col-span-4 space-y-12">

                            {/* SECTION -> SAVED & INTERESTS */}
                            <section>
                                <SectionHeader icon="favorite" title="Interests" subtitle="" accent={ACCENT} />
                                <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-sm">
                                    <div className="flex border-b border-white/5">
                                        {['saved', 'followed'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveInterestTab(tab)}
                                                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeInterestTab === tab ? 'text-primary bg-primary/5' : 'text-white/40 hover:text-white'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {properties.slice(0, 3).map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => handleAction(`Opening ${p.name}`)}
                                                className="flex items-center gap-4 group cursor-pointer"
                                            >
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
                                                    <img src={p.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[11px] font-bold text-white truncate uppercase tracking-tighter group-hover:text-primary transition-colors">{p.name}</h5>
                                                    <p className="text-[10px] text-white/40 truncate">{p.locality}, {p.city}</p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-[10px] font-black text-primary">₹ {(p.price / 10000000).toFixed(2)} CR</p>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleAction('Unsaving Property'); }}
                                                                className="text-white/20 hover:text-primary transition-colors"
                                                            >
                                                                <Bookmark size={10} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <ActionButton
                                            variant="tertiary"
                                            className="w-full mt-4"
                                            onClick={() => handleAction(`Viewing all ${activeInterestTab} items`)}
                                        >
                                            View All {activeInterestTab === 'saved' ? 'Saved' : 'Followed'}
                                        </ActionButton>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION -> COMMUNICATION CENTER */}
                            <section>
                                <SectionHeader icon="chat" title="Inbox" subtitle="" accent={ACCENT} />
                                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4 backdrop-blur-sm">
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 cursor-pointer transition-all group">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[10px] text-primary">AR</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="text-[11px] font-bold text-white group-hover:text-primary transition-colors">Arjun Reddy</span>
                                                <span className="text-[8px] text-white/20">12:45 PM</span>
                                            </div>
                                            <p className="text-[10px] text-white/40 truncate">I've sent the updated floor plan...</p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    </div>
                                    <ActionButton
                                        variant="tertiary"
                                        className="w-full"
                                        onClick={() => handleAction('Opening Messenger')}
                                    >
                                        Open Messenger
                                    </ActionButton>
                                </div>
                            </section>

                            {/* SECTION -> DOCUMENTS & VERIFICATION */}
                            <section>
                                <SectionHeader icon="description" title="Documents" subtitle="" accent={ACCENT} />
                                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4 backdrop-blur-sm">
                                    {[
                                        { label: 'Aadhar Card / PAN', status: 'verified', icon: CheckCircle2 },
                                        { label: 'RERA License', status: 'pending', icon: History },
                                        { label: 'Address Proof', status: 'upload', icon: Upload }
                                    ].map((doc, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleAction(`Managing ${doc.label}`)}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <doc.icon size={16} className={`${doc.status === 'verified' ? 'text-emerald-500' : doc.status === 'pending' ? 'text-amber-500' : 'text-white/20'} group-hover:scale-110 transition-transform`} />
                                                <span className="text-[11px] font-medium text-white/60 uppercase tracking-tight">{doc.label}</span>
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${doc.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                                                {doc.status}
                                            </span>
                                        </div>
                                    ))}
                                    <ActionButton
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => handleAction('Syncing with Records')}
                                    >
                                        Manager Records
                                    </ActionButton>
                                </div>
                            </section>

                            {/* SECTION -> SECURITY */}
                            <section>
                                <SectionHeader icon="lock" title="Security" subtitle="" accent={ACCENT} />
                                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4 backdrop-blur-sm">
                                    <button
                                        onClick={() => handleAction('Toggling 2FA')}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Shield size={18} className="text-primary group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Two-Factor Auth</span>
                                        </div>
                                        <div className="w-10 h-5 bg-primary rounded-full relative">
                                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-fullShadow shadow-lg"></div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleAction('Redirecting to Password Reset')}
                                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 text-left transition-all group"
                                    >
                                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Last Password Change</div>
                                        <div className="text-xs font-bold text-white uppercase tracking-tight">July 15, 2025</div>
                                        <div className="text-[10px] text-primary mt-2 font-black uppercase tracking-widest group-hover:underline cursor-pointer">Change Password</div>
                                    </button>
                                    <div className="pt-4 border-t border-white/5">
                                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Active Sessions</div>
                                        <div className="flex items-center justify-between text-[10px]">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-white/60">Chrome on Windows (Current)</span>
                                                <span
                                                    className="text-primary hover:underline cursor-pointer font-bold uppercase tracking-widest text-[8px]"
                                                    onClick={() => handleAction('Logging out other devices')}
                                                >
                                                    Logout other sessions
                                                </span>
                                            </div>
                                            <span className="text-emerald-500 font-bold uppercase tracking-widest">Online</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full mt-4 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                                    >
                                        Sign Out Session
                                    </button>
                                </div>
                            </section>

                        </div>

                    </div>

                    <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-['Anton'] text-white tracking-wide uppercase mb-2">Homienest Data Ethics</h3>
                            <p className="text-xs text-white/40 max-w-md">Your privacy is our priority. We encrypt all sensitive documents and never share your contact details without explicit consent during an inquiry.</p>
                        </div>
                        <div className="flex gap-4">
                            <ActionButton variant="tertiary">Privacy Policy</ActionButton>
                            <ActionButton variant="tertiary">Terms of Service</ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}

function X({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    );
}

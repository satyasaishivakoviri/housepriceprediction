"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGuard from '@/components/AuthGuard';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { TabBar, StatCard, SectionHeader, EmptyState, ProgressRing } from '@/components/ui/RoleTheme';
import { properties, clients, cityData, monthlyTrends, formatPrice, formatNumber, pipelineStages, pipelineLabels, pipelineColors, agentTasks, agentCalendar, commissionHistory, agentDocuments, buyerFeedback } from '@/lib/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, Cell } from 'recharts';

const ACCENT = '#b8860b';
const deals = [
    { id: 1, client: "Rajesh Sharma", property: "Green Valley Villas", value: 12500000, stage: "showing", probability: 40, closeDate: "2026-04-15" },
    { id: 2, client: "Amit Verma", property: "Ocean View Penthouse", value: 45000000, stage: "offer", probability: 70, closeDate: "2026-03-10" },
    { id: 3, client: "Karan Mehta", property: "Palm Grove Estate", value: 22000000, stage: "qualified", probability: 30, closeDate: "2026-05-01" },
    { id: 4, client: "Ananya Iyer", property: "Tech Park Residences", value: 7800000, stage: "showing", probability: 50, closeDate: "2026-04-01" },
    { id: 5, client: "Vikram Singh", property: "Royal Heights", value: 9800000, stage: "closed", probability: 100, closeDate: "2026-01-28" },
];
const commissionRate = 0.02;
const monthlyClosings = [
    { month: "Sep", closings: 2, commission: 3.2 }, { month: "Oct", closings: 3, commission: 4.8 },
    { month: "Nov", closings: 1, commission: 1.6 }, { month: "Dec", closings: 4, commission: 7.1 },
    { month: "Jan", closings: 2, commission: 3.9 }, { month: "Feb", closings: 1, commission: 2.0 },
];

// ==================== 1. DASHBOARD TAB ====================
function DashboardTab({ deals: propDeals }) {
    const currentDeals = propDeals || deals;
    const totalCommission = commissionHistory.filter(c => c.status === 'paid').reduce((s, c) => s + c.commission, 0);
    const expectedCommission = commissionHistory.filter(c => c.status === 'expected').reduce((s, c) => s + c.commission, 0);
    const activeDeals = currentDeals.filter(d => d.stage !== 'closed').length;
    const pendingTasks = agentTasks.filter(t => t.status === 'pending').length;
    const todayEvents = agentCalendar.filter(e => e.date === '2026-02-12');
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="auto_awesome" label="AI Valuation Accuracy" value="99.1%" color="#ef4444" />
                <StatCard icon="payments" label="Commission Earned" value={formatPrice(totalCommission)} trend="12" color={ACCENT} />
                <StatCard icon="account_balance_wallet" label="Expected Earnings" value={formatPrice(expectedCommission)} color="#22c55e" />
                <StatCard icon="handshake" label="Active Deals" value={activeDeals} color="#3b82f6" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Commission Chart */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-navy text-sm mb-4">Monthly Commission (₹ Lakhs)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyClosings}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: '#999' }} /><YAxis tick={{ fontSize: 10, fill: '#999' }} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: 'none' }} /><Bar dataKey="commission" radius={[6, 6, 0, 0]} fill={ACCENT} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Today */}
                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <h3 className="font-bold text-navy text-sm mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-amber-600">today</span>Today&apos;s Schedule</h3>
                        {todayEvents.length === 0 ? <p className="text-xs text-navy/30">No events today</p> : todayEvents.map(e => (
                            <div key={e.id} className="flex items-center gap-3 mb-3">
                                <div className="w-1 h-10 rounded-full" style={{ background: e.color }}></div>
                                <div><div className="text-xs font-bold text-navy">{e.title}</div><div className="text-[10px] text-navy/30">{e.time} • {e.duration}{e.client && ` • ${e.client}`}</div></div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <h3 className="font-bold text-navy text-sm mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-red-500">priority_high</span>Urgent Tasks ({agentTasks.filter(t => t.priority === 'high' && t.status === 'pending').length})</h3>
                        {agentTasks.filter(t => t.priority === 'high' && t.status === 'pending').map(t => (
                            <div key={t.id} className="flex items-center gap-3 mb-2.5">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <div className="flex-1"><div className="text-[11px] font-bold text-navy">{t.title}</div><div className="text-[9px] text-navy/25">Due: {t.dueDate}</div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Deal Pipeline Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-navy text-sm mb-4">Deal Pipeline</h3>
                <div className="flex items-center justify-between overflow-x-auto pb-2">
                    {pipelineStages.map((s, i) => {
                        const stageDeals = deals.filter(d => d.stage === s); const val = stageDeals.reduce((a, d) => a + d.value, 0); return <React.Fragment key={s}>
                            <div className="flex flex-col items-center min-w-[90px]">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2" style={{ background: pipelineColors[s] }}>{stageDeals.length}</div>
                                <span className="text-[10px] font-bold text-navy/50 uppercase tracking-wider text-center">{pipelineLabels[s]}</span>
                                {val > 0 && <span className="text-[9px] text-navy/25 mt-1">{formatPrice(val)}</span>}
                            </div>
                            {i < pipelineStages.length - 1 && <div className="h-0.5 flex-1 mx-2 bg-navy/10 rounded"></div>}
                        </React.Fragment>
                    })}
                </div>
            </div>
        </div>
    );
}

// ==================== 2. LEADS TAB ====================
function LeadsTab() {
    const [filter, setFilter] = useState('all');
    const filtered = filter === 'all' ? clients : filter === 'buyer' ? clients.filter(c => c.type === 'buyer') : clients.filter(c => c.type === 'seller');
    const sorted = [...filtered].sort((a, b) => b.leadScore - a.leadScore);
    const urgencyColors = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">{[['all', 'All Leads'], ['buyer', 'Buyers'], ['seller', 'Sellers']].map(([k, l]) => (
                    <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === k ? 'bg-amber-700 text-white' : 'bg-amber-50 text-navy/40'}`}>{l}</button>
                ))}</div>
            </div>
            {/* Conversion funnel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-amber-600">filter_alt</span>Lead-to-Close Funnel</h3>
                <div className="space-y-2">{pipelineStages.map(s => {
                    const count = clients.filter(c => c.status === s).length; const pct = Math.round(count / clients.length * 100); return (
                        <div key={s} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-navy/40 w-20 text-right uppercase">{pipelineLabels[s]}</span>
                            <div className="flex-1 h-6 bg-navy/[0.03] rounded-full overflow-hidden"><div className="h-full rounded-full flex items-center px-3 text-[9px] text-white font-bold" style={{ width: `${Math.max(pct, 10)}%`, background: pipelineColors[s] }}>{count}</div></div>
                            <span className="text-[10px] font-bold text-navy/30 w-10">{pct}%</span>
                        </div>
                    )
                })}</div>
            </div>
            {/* Lead cards */}
            {sorted.map(c => (
                <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: ACCENT }}>{c.avatar}</div>
                            <div>
                                <div className="flex items-center gap-2"><span className="text-sm font-bold text-navy">{c.name}</span><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${c.type === 'buyer' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{c.type}</span></div>
                                <div className="text-[10px] text-navy/30">{c.city} • Budget: {formatPrice(c.budget)} • {c.interactions} interactions</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center"><div className="w-2 h-2 rounded-full mb-0.5" style={{ background: urgencyColors[c.urgency] }}></div><span className="text-[8px] text-navy/25 uppercase">{c.urgency}</span></div>
                            <ProgressRing value={c.leadScore} size={48} color={c.leadScore >= 80 ? '#22c55e' : c.leadScore >= 50 ? '#f59e0b' : '#94a3b8'} label="Score" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-[10px]">
                        <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: `${pipelineColors[c.status]}15`, color: pipelineColors[c.status] }}>{pipelineLabels[c.status] || c.status}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold ${c.preApproved ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{c.preApproved ? 'Pre-Approved' : 'Not Approved'}</span>
                        <span className="text-navy/25">Source: {c.source}</span>
                        <span className="text-navy/25">Last: {c.lastContact}</span>
                        <span className="text-navy/25">{c.documentsCount} docs</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ==================== 3. CRM TAB ====================
function CRMTab({ localProps = [] }) {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase()));
    const sel = clients.find(c => c.id === selected);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-medium mb-4 focus:outline-none focus:border-amber-400 text-white" />
                <div className="space-y-1.5">{filtered.map(c => (
                    <button key={c.id} onClick={() => setSelected(c.id)} className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${selected === c.id ? 'bg-amber-100/50 border border-amber-200' : 'hover:bg-navy/[0.03]'}`}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: ACCENT }}>{c.avatar}</div>
                        <div className="flex-1 min-w-0"><div className="text-xs font-bold text-navy truncate">{c.name}</div><div className="text-[9px] text-navy/25">{c.city} • {c.type}</div></div>
                        <div className="w-2 h-2 rounded-full" style={{ background: pipelineColors[c.status] }}></div>
                    </button>
                ))}</div>
            </div>
            {/* Client Detail */}
            <div className="lg:col-span-2 space-y-4">
                {sel ? <>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: ACCENT }}>{sel.avatar}</div>
                            <div>
                                <div className="flex items-center gap-2"><h3 className="text-lg font-bold text-navy">{sel.name}</h3><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${sel.type === 'buyer' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{sel.type}</span></div>
                                <div className="text-xs text-navy/40">{sel.email} • {sel.phone}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                            {[['Budget', formatPrice(sel.budget)], ['City', sel.city], ['Stage', pipelineLabels[sel.status] || sel.status], ['Score', `${sel.leadScore}/100`]].map(([l, v]) => (
                                <div key={l} className="bg-navy/[0.02] rounded-xl p-3"><div className="text-sm font-bold text-navy">{v}</div><div className="text-[9px] text-navy/30 font-bold uppercase">{l}</div></div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h4 className="font-bold text-navy text-xs mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-amber-600">sticky_note_2</span>Notes</h4>
                            <div className="bg-amber-50/50 rounded-xl p-3 text-xs text-navy/60 mb-2">{sel.notes}</div>
                            <textarea placeholder="Add a note..." className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-400 resize-none text-white" rows={3}></textarea>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h4 className="font-bold text-navy text-xs mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">folder</span>Documents ({sel.documentsCount})</h4>
                            {agentDocuments.filter(d => d.client === sel.name).length > 0 ? agentDocuments.filter(d => d.client === sel.name).map(d => (
                                <div key={d.id} className="flex items-center gap-3 p-2.5 bg-navy/[0.02] rounded-lg mb-2">
                                    <span className="material-symbols-outlined text-sm text-navy/30">description</span>
                                    <div className="flex-1 min-w-0"><div className="text-[11px] font-bold text-navy truncate">{d.name}</div><div className="text-[9px] text-navy/25">{d.size} • {d.date}</div></div>
                                </div>
                            )) : <p className="text-[11px] text-navy/25 italic">No documents uploaded</p>}
                            <button onClick={() => alert("Document Upload: Please select document file.")} className="w-full mt-2 px-3 py-2 bg-navy/[0.03] rounded-xl text-[10px] font-bold text-navy/40 hover:bg-navy/[0.06] transition-all cursor-pointer">+ Upload Document</button>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <h4 className="font-bold text-navy text-xs mb-3">Quick Actions</h4>
                        <div className="flex gap-2 flex-wrap">{[['Call', 'call', '#22c55e'], ['Email', 'email', '#3b82f6'], ['Schedule', 'event', '#8b5cf6'], ['Task', 'add_task', '#f59e0b']].map(([l, ic, c]) => (
                            <button onClick={() => alert(`${l} action initiated for ${sel.name}`)} key={l} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 cursor-pointer" style={{ background: c }}><span className="material-symbols-outlined text-sm">{ic}</span>{l}</button>
                        ))}</div>
                    </div>

                    {sel.type === 'buyer' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500">hub</span> Recommended Properties (AI Match)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...localProps, ...properties]
                                    .filter(p => p.city === sel.city && p.price <= sel.budget * 1.2 && p.status === 'active')
                                    .slice(0, 2)
                                    .map(p => (
                                        <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:border-red-500/30 transition-all">
                                            <div className="h-24 bg-slate-800 relative">
                                                <img src={p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400"} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt="" />
                                                <div className="absolute inset-0 bg-black/40" />
                                                <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white">{formatPrice(p.price)}</div>
                                            </div>
                                            <div className="p-3">
                                                <div className="text-[11px] font-bold text-white truncate">{p.name}</div>
                                                <div className="text-[9px] text-white/40 mb-2">{p.locality}</div>
                                                <button onClick={() => alert(`Property proposal for ${p.name} sent to ${sel.name}!`)} className="w-full py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-[9px] font-bold uppercase rounded-lg transition-all border border-red-500/20 cursor-pointer">Send Proposal</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </> : <EmptyState icon="person_search" title="Select a client" subtitle="Choose from the list to view their profile" />}
            </div>
        </div>
    );
}

// ==================== 4. PIPELINE TAB ====================
function PipelineTab({ deals: propDeals }) {
    const currentDeals = propDeals || deals;
    return (
        <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-amber-600">view_kanban</span>Deal Pipeline</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {pipelineStages.map(stage => {
                        const stageDeals = currentDeals.filter(d => d.stage === stage); return (
                            <div key={stage} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: pipelineColors[stage] }}>{pipelineLabels[stage]}</span>
                                    <span className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center" style={{ background: pipelineColors[stage] }}>{stageDeals.length}</span>
                                </div>
                                <div className="h-1 rounded-full" style={{ background: pipelineColors[stage] }}></div>
                                {stageDeals.map(d => (
                                    <div key={d.id} className="bg-white rounded-xl p-3 border border-navy/5 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                        <div className="text-[11px] font-bold text-navy mb-1 line-clamp-1">{d.client}</div>
                                        <div className="text-[9px] text-navy/30 mb-2 line-clamp-1">{d.property}</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-navy">{formatPrice(d.value)}</span>
                                            <span className="text-[9px] font-bold" style={{ color: pipelineColors[stage] }}>{d.probability}%</span>
                                        </div>
                                    </div>
                                ))}
                                {stageDeals.length === 0 && <div className="bg-navy/[0.02] border border-dashed border-navy/10 rounded-xl p-4 text-center text-[10px] text-navy/20">Empty</div>}
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* Weighted Pipeline */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[['Total Pipeline', currentDeals.reduce((s, d) => s + d.value, 0), '#f8fafc'], ['Weighted Value', currentDeals.reduce((s, d) => s + d.value * d.probability / 100, 0), ACCENT], ['Expected Commission', currentDeals.reduce((s, d) => s + d.value * d.probability / 100 * commissionRate, 0), '#22c55e']].map(([l, v, c]) => (
                    <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                        <div className="text-2xl font-['Anton'] text-navy tracking-wide">{formatPrice(v)}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: c }}>{l}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ==================== 5. PRODUCTIVITY TAB ====================
function ProductivityTab() {
    const [taskFilter, setTaskFilter] = useState('pending');
    const filteredTasks = taskFilter === 'all' ? agentTasks : agentTasks.filter(t => t.status === taskFilter);
    const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };
    const typeIcons = { call: 'call', document: 'description', follow_up: 'replay', showing: 'visibility', listing: 'home', report: 'assessment' };
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-amber-600">calendar_month</span>Upcoming Schedule</h3>
                    <div className="space-y-3">{agentCalendar.map(e => (
                        <div key={e.id} className="flex items-center gap-3 p-3 bg-navy/[0.02] rounded-xl hover:bg-navy/[0.04] transition-all">
                            <div className="w-1.5 h-12 rounded-full" style={{ background: e.color }}></div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-navy">{e.title}</div>
                                <div className="text-[10px] text-navy/30">{e.date} • {e.time} • {e.duration}{e.client && ` • ${e.client}`}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${e.type === 'showing' ? 'bg-blue-100 text-blue-600' : e.type === 'call' ? 'bg-green-100 text-green-600' : e.type === 'meeting' ? 'bg-purple-100 text-purple-600' : e.type === 'listing' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>{e.type.replace('_', ' ')}</span>
                        </div>
                    ))}</div>
                </div>
                {/* Tasks */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-navy text-sm flex items-center gap-2"><span className="material-symbols-outlined text-green-500">checklist</span>Tasks</h3>
                        <div className="flex gap-1.5">{[['pending', 'Pending'], ['completed', 'Done'], ['all', 'All']].map(([k, l]) => (
                            <button key={k} onClick={() => setTaskFilter(k)} className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase ${taskFilter === k ? 'bg-amber-700 text-white' : 'bg-amber-50 text-navy/30'}`}>{l}</button>
                        ))}</div>
                    </div>
                    <div className="space-y-2">{filteredTasks.map(t => (
                        <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl ${t.status === 'completed' ? 'bg-green-50/50' : 'bg-navy/[0.02]'}`}>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${t.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-navy/20'}`}>{t.status === 'completed' && '✓'}</div>
                            <div className="flex-1 min-w-0">
                                <div className={`text-[11px] font-bold ${t.status === 'completed' ? 'text-navy/30 line-through' : 'text-navy'}`}>{t.title}</div>
                                <div className="text-[9px] text-navy/25">Due: {t.dueDate} • {t.client}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-navy/20">{typeIcons[t.type] || 'task'}</span>
                                <span className="w-2 h-2 rounded-full" style={{ background: priorityColors[t.priority] }}></span>
                            </div>
                        </div>
                    ))}</div>
                    <button onClick={() => alert("New Task Form: Enter task details in CRM.")} className="w-full mt-3 px-3 py-2.5 bg-amber-50 rounded-xl text-[10px] font-bold text-amber-700 hover:bg-amber-100 transition-all cursor-pointer">+ Add New Task</button>
                </div>
            </div>
            {/* Follow-up queue */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-red-500">notifications_active</span>Follow-Up Queue</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {clients.filter(c => c.status !== 'closed').slice(0, 6).map(c => {
                        const daysSince = Math.floor((Date.now() - new Date(c.lastContact).getTime()) / 86400000); return (
                            <div key={c.id} className={`p-4 rounded-xl border ${daysSince > 3 ? 'bg-red-50 border-red-200' : daysSince > 1 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                                <div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-navy">{c.name}</span><span className={`text-[9px] font-bold ${daysSince > 3 ? 'text-red-600' : daysSince > 1 ? 'text-amber-600' : 'text-green-600'}`}>{daysSince}d ago</span></div>
                                <div className="text-[10px] text-navy/30">{c.preference}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

// ==================== 6. LISTINGS INTEL TAB ====================
function ListingsIntelTab() {
    const managedListings = properties.filter(p => [1, 2, 4, 7, 9, 12].includes(p.id));
    return (
        <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-navy/5"><h3 className="font-bold text-navy text-sm">Listing Performance</h3></div>
                <div className="overflow-x-auto"><table className="w-full text-xs">
                    <thead><tr className="bg-navy/[0.02]">{['Property', 'Views', 'Inquiries', 'Saves', 'CTR', 'Days', 'Demand'].map(h => <th key={h} className="px-4 py-3 text-left text-navy/30 font-bold uppercase tracking-wider">{h}</th>)}</tr></thead>
                    <tbody>{managedListings.map(p => (
                        <tr key={p.id} className="border-t border-navy/5 hover:bg-navy/[0.01]">
                            <td className="px-4 py-3"><div className="font-bold text-navy">{p.name}</div><div className="text-[9px] text-navy/25">{p.locality}, {p.city}</div></td>
                            <td className="px-4 py-3 text-navy/60">{p.views}</td><td className="px-4 py-3 text-navy/60">{p.inquiries}</td>
                            <td className="px-4 py-3 text-navy/60">{p.saves}</td><td className="px-4 py-3 text-navy/60">{p.ctr}%</td>
                            <td className="px-4 py-3 text-navy/60">{p.daysListed}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${p.marketTemp === 'hot' ? 'bg-red-100 text-red-600' : p.marketTemp === 'warm' ? 'bg-amber-100 text-amber-600' : p.marketTemp === 'neutral' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{p.marketTemp}</span></td>
                        </tr>
                    ))}</tbody>
                </table></div>
            </div>
            {/* Buyer Feedback */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">rate_review</span>Buyer Feedback</h3>
                <div className="space-y-3">{buyerFeedback.map(f => (
                    <div key={f.id} className="bg-navy/[0.02] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div><span className="text-xs font-bold text-navy">{f.propertyName}</span><span className="text-[10px] text-navy/30 ml-3">by {f.buyer}</span></div>
                            <div className="flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <span key={i} className={`text-xs ${i < f.rating ? 'text-amber-400' : 'text-navy/10'}`}>★</span>)}</div>
                        </div>
                        <p className="text-[11px] text-navy/50 italic">&ldquo;{f.feedback}&rdquo;</p>
                        <div className="text-[9px] text-navy/20 mt-1">{f.date}</div>
                    </div>
                ))}</div>
            </div>
        </div>
    );
}

// ==================== 7. FINANCIALS TAB ====================
function FinancialsTab() {
    const totalPaid = commissionHistory.filter(c => c.status === 'paid').reduce((s, c) => s + c.commission, 0);
    const totalExpected = commissionHistory.filter(c => c.status === 'expected').reduce((s, c) => s + c.commission, 0);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon="payments" label="Total Earned" value={formatPrice(totalPaid)} trend="18" color="#22c55e" />
                <StatCard icon="account_balance_wallet" label="Expected" value={formatPrice(totalExpected)} color={ACCENT} />
                <StatCard icon="receipt" label="Paid Deals" value={commissionHistory.filter(c => c.status === 'paid').length} color="#3b82f6" />
                <StatCard icon="pending_actions" label="Pending Deals" value={commissionHistory.filter(c => c.status === 'expected').length} color="#f59e0b" />
            </div>
            {/* Monthly chart */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-navy text-sm mb-4">Monthly Performance (₹ Lakhs)</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyClosings}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: '#999' }} /><YAxis tick={{ fontSize: 10, fill: '#999' }} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: 'none' }} /><Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="closings" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Closings" /><Bar dataKey="commission" fill={ACCENT} radius={[6, 6, 0, 0]} name="Commission (L)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/* Commission History */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-navy/5"><h3 className="font-bold text-navy text-sm">Commission History</h3></div>
                <div className="overflow-x-auto"><table className="w-full text-xs">
                    <thead><tr className="bg-navy/[0.02]">{['Deal', 'Client', 'Deal Value', 'Commission (2%)', 'Date', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-navy/30 font-bold uppercase tracking-wider">{h}</th>)}</tr></thead>
                    <tbody>{commissionHistory.map(c => (
                        <tr key={c.id} className="border-t border-navy/5 hover:bg-navy/[0.01]">
                            <td className="px-4 py-3 font-bold text-navy">{c.deal}</td>
                            <td className="px-4 py-3 text-navy/60">{c.client}</td>
                            <td className="px-4 py-3 text-navy/60">{formatPrice(c.dealValue)}</td>
                            <td className="px-4 py-3 font-bold text-green-600">{formatPrice(c.commission)}</td>
                            <td className="px-4 py-3 text-navy/40">{c.closedDate || '—'}</td>
                            <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${c.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{c.status}</span></td>
                        </tr>
                    ))}</tbody>
                </table></div>
            </div>
        </div>
    );
}

// ==================== MAIN PAGE ====================
const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'crm', label: 'CRM', icon: 'contacts' },
    { id: 'pipeline', label: 'Pipeline', icon: 'view_kanban' }
];

export default function AgentPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notification, setNotification] = useState(null);
    const [localTours, setLocalTours] = useState([]);
    const [localOffers, setLocalOffers] = useState([]);
    const [localProps, setLocalProps] = useState([]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        const tours = localStorage.getItem('buyerTourRequests');
        if (tours) setLocalTours(JSON.parse(tours));

        const offers = localStorage.getItem('buyerOffers');
        if (offers) setLocalOffers(JSON.parse(offers));

        const props = localStorage.getItem('userProperties');
        if (props) setLocalProps(JSON.parse(props));
    }, []);

    const updateTourStatus = (id, status) => {
        const updated = localTours.map(t => t.id === id ? { ...t, status } : t);
        setLocalTours(updated);
        localStorage.setItem('buyerTourRequests', JSON.stringify(updated));
        showNotification(`Tour ${status} successfully!`);
    };

    const updateOfferStatus = (id, status) => {
        const updated = localOffers.map(o => o.id === id ? { ...o, status } : o);
        setLocalOffers(updated);
        localStorage.setItem('buyerOffers', JSON.stringify(updated));
        showNotification(`Offer ${status}! Notification sent to buyer.`);
    };

    const combinedDeals = useMemo(() => {
        const realDeals = localOffers.map(o => ({
            id: o.id,
            client: "Real Buyer",
            property: o.propertyName,
            value: o.offerPrice,
            stage: o.status === 'pending' ? 'offer' : o.status === 'accepted' ? 'closed' : 'negotiation',
            probability: o.status === 'pending' ? 60 : o.status === 'accepted' ? 100 : 30,
            isReal: true
        }));
        return [...realDeals, ...deals];
    }, [localOffers]);

    return (
        <AuthGuard>
            <div className="relative min-h-screen text-white">
                <div className="absolute inset-0 z-0">
                    <BackgroundPaths title="" showCta={false} />
                </div>
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-20">

                    <SectionHeader icon="handshake" title="Agent Portal" subtitle="Market Intelligence • Client Relationship • Deals Management" accent={ACCENT} />
                    <TabBar 
                        tabs={tabs.map(t => ({ 
                            ...t, 
                            badge: t.id === 'crm' ? localTours.filter(t => t.status === 'pending').length : 
                                   t.id === 'pipeline' ? localOffers.filter(o => o.status === 'pending').length : 0 
                        }))} 
                        active={activeTab} 
                        onChange={setActiveTab} 
                        accent={ACCENT} 
                    />
                    
                    <div className="mt-8">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard icon="explore" label="Managed Properties" value={localProps.length + properties.length} color="#ef4444" />
                                    <StatCard icon="event" label="Pending Site Visits" value={localTours.filter(t => t.status === 'pending').length} trend={localTours.length > 0 ? "New" : ""} color={ACCENT} />
                                    <StatCard icon="gavel" label="Active Offers" value={localOffers.filter(o => o.status === 'pending').length} color="#22c55e" />
                                    <StatCard icon="payments" label="Total Pipeline" value={formatPrice(combinedDeals.reduce((a, b) => a + b.value, 0))} color="#3b82f6" />
                                </div>
                                <DashboardTab deals={combinedDeals} />
                            </div>
                        )}
                        
                        {activeTab === 'crm' && (
                            <div className="space-y-6">
                                {localTours.length > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                                        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-amber-500">pending_actions</span> Incoming Site Visit Requests
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {localTours.map(tour => (
                                                <div key={tour.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-xs font-bold text-white">{tour.propertyName}</div>
                                                        <div className="text-[10px] text-white/40 uppercase tracking-widest">{tour.date} @ {tour.time}</div>
                                                        <div className="mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full inline-block" style={{ background: tour.status === 'pending' ? '#f59e0b20' : '#22c55e20', color: tour.status === 'pending' ? '#f59e0b' : '#22c55e' }}>
                                                            {tour.status.toUpperCase()}
                                                        </div>
                                                    </div>
                                                    {tour.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => updateTourStatus(tour.id, 'confirmed')} className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all"><span className="material-symbols-outlined text-sm">check</span></button>
                                                            <button onClick={() => updateTourStatus(tour.id, 'rejected')} className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-all"><span className="material-symbols-outlined text-sm">close</span></button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <CRMTab localProps={localProps} />
                            </div>
                        )}
                        
                        {activeTab === 'pipeline' && (
                            <div className="space-y-6">
                                {localOffers.length > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                                        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-red-500">gavel</span> Active Property Offers
                                        </h3>
                                        <div className="space-y-3">
                                            {localOffers.map(offer => (
                                                <div key={offer.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 font-bold text-xs">OFFER</div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white">{offer.propertyName}</div>
                                                            <div className="text-[10px] text-white/40">Buyer offered {formatPrice(offer.offerPrice)} (List: {formatPrice(offer.listPrice)})</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${offer.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : offer.status === 'accepted' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                            {offer.status.toUpperCase()}
                                                        </div>
                                                        {offer.status === 'pending' && (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => updateOfferStatus(offer.id, 'accepted')} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase transition-all">Accept</button>
                                                                <button onClick={() => updateOfferStatus(offer.id, 'rejected')} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase transition-all">Reject</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <PipelineTab deals={combinedDeals} />
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#111] border border-white/10 shadow-2xl shadow-amber-600/20"
                        >
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">notifications</span>
                            </div>
                            <p className="text-sm font-bold text-white tracking-wide">{notification.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthGuard>
    );
}

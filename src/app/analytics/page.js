"use client";
import React, { useState, useMemo } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { SectionHeader, StatCard } from '@/components/ui/RoleTheme';


import { cityData } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';

const ACCENT = '#c93a2a';

// Mock Data Generators for Analytics
const generateForecastData = () => {
    const data = [];
    const startYear = 2021;
    let baseValue = 12500; // Base avg price/sqft

    for (let year = startYear; year <= 2026; year++) {
        for (let month = 0; month < 12; month++) {
            // Add trend + seasonality + random noise
            const trend = (year - startYear) * 12 + month;
            const growthFactor = 1.006; // 0.6% monthly growth
            const seasonality = Math.sin(month * Math.PI / 6) * 200;
            const noise = (Math.random() - 0.5) * 150;

            baseValue = baseValue * growthFactor;

            data.push({
                date: `${new Date(year, month).toLocaleString('default', { month: 'short' })} '${year.toString().substr(2)}`,
                value: Math.round(baseValue + seasonality + noise),
                year: year
            });
        }
    }
    return data;
};

export default function AnalyticsPage() {
    const [compareCity1, setCompareCity1] = useState(cityData[0]);
    const [compareCity2, setCompareCity2] = useState(cityData[1]);
    const forecastData = useMemo(() => generateForecastData(), []);


    // Derived Stats
    const totalInventory = cityData.reduce((acc, curr) => acc + curr.inventory, 0);
    const avgGrowth = (cityData.reduce((acc, curr) => acc + curr.growth, 0) / cityData.length).toFixed(1);
    const maxPrice = Math.max(...cityData.map(c => c.pricePerSqft));

    const topCities = [...cityData].sort((a, b) => b.growth - a.growth).slice(0, 5);

    return (
        <AuthGuard>
            <div className="relative min-h-screen text-white bg-[#0a0a0c]">
                <div className="absolute inset-0 z-0 opacity-40">
                    <BackgroundPaths title="" showCta={false} />
                </div>

                <div className="relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
                    {/* HEADER */}
                    <div className="mb-12">
                        <SectionHeader
                            icon="query_stats"
                            title="Market Intelligence"
                            subtitle="Real-time Analytics • Trends • Forecasts"
                            accent={ACCENT}
                        />
                    </div>

                    {/* KPI CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            icon="monetization_on"
                            label="Market Cap Estimate"
                            value="₹8.4T"
                            trend="12.5"
                            color={ACCENT}
                        />
                        <StatCard
                            icon="trending_up"
                            label="Avg YoY Growth"
                            value={`${avgGrowth}%`}
                            trend="2.1"
                            color="#22c55e"
                        />
                        <StatCard
                            icon="warehouse"
                            label="Active Inventory"
                            value={totalInventory.toLocaleString()}
                            trend="-5.4" // Inventory tightening
                            color="#3b82f6"
                        />
                        <StatCard
                            icon="percent"
                            label="Avg Rental Yield"
                            value="3.8%"
                            sub="Stable"
                            color="#f59e0b"
                        />
                    </div>

                    {/* MAIN CHART: FORECAST 2026 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-['Anton'] tracking-wide">Market Price Forecast 2021-2026</h3>
                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Aggregate Price Index (₹/Sq.ft)</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase">Historical</div>
                                <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase">Projected</div>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                                        tickMargin={10}
                                        interval={11}
                                    />
                                    <YAxis
                                        hide // minimalist look
                                        domain={['dataMin - 1000', 'dataMax + 1000']}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Price/Sq.ft']}
                                    />
                                    <ReferenceLine x="Dec '25" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={ACCENT}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COL: CITY COMPARATOR */}
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-['Anton'] tracking-wide">City Comparator</h3>
                                <div className="flex gap-4">
                                    <select
                                        value={compareCity1.city}
                                        onChange={(e) => setCompareCity1(cityData.find(c => c.city === e.target.value))}
                                        className="bg-[#0a0a0c] border border-white/20 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-red-500"
                                    >
                                        {cityData.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                                    </select>
                                    <span className="text-white/20 font-bold">VS</span>
                                    <select
                                        value={compareCity2.city}
                                        onChange={(e) => setCompareCity2(cityData.find(c => c.city === e.target.value))}
                                        className="bg-[#0a0a0c] border border-white/20 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-red-500"
                                    >
                                        {cityData.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <ComparisonBar
                                    label="Price per Sq.ft"
                                    val1={compareCity1.pricePerSqft}
                                    val2={compareCity2.pricePerSqft}
                                    max={maxPrice}
                                    format={(v) => `₹${v.toLocaleString()}`}
                                />
                                <ComparisonBar
                                    label="YoY Growth"
                                    val1={compareCity1.growth}
                                    val2={compareCity2.growth}
                                    max={20}
                                    format={(v) => `${v}%`}
                                    color="#22c55e"
                                />
                                <ComparisonBar
                                    label="Demand Index"
                                    val1={compareCity1.demand}
                                    val2={compareCity2.demand}
                                    max={100}
                                    format={(v) => v}
                                    color="#f59e0b"
                                />
                                <ComparisonBar
                                    label="Rental Yield (Est)"
                                    val1={compareCity1.absorptionRate / 20} // Mock calc
                                    val2={compareCity2.absorptionRate / 20}
                                    max={5}
                                    format={(v) => `${v.toFixed(1)}%`}
                                    color="#8b5cf6"
                                />
                            </div>
                        </div>

                        {/* RIGHT COL: TOP HOTSPOTS */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                            <h3 className="text-lg font-['Anton'] tracking-wide mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500 animate-pulse">local_fire_department</span>
                                Investment Hotspots
                            </h3>
                            <div className="space-y-4">
                                {topCities.map((city, i) => (
                                    <div key={city.city} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' : 'bg-white/10 text-white/60'}`}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm text-white group-hover:text-red-400 transition-colors">{city.city}</div>
                                            <div className="text-[10px] text-white/40">Inventory: {city.inventory.toLocaleString()} units</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-400">+{city.growth}%</div>
                                            <div className="text-[9px] text-white/30 uppercase">Growth</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
                                View Full Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}

function ComparisonBar({ label, val1, val2, max, format, color = ACCENT }) {
    const p1 = Math.min((val1 / max) * 100, 100);
    const p2 = Math.min((val2 / max) * 100, 100);

    return (
        <div>
            <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                <span>{format(val1)}</span>
                <span>{label}</span>
                <span>{format(val2)}</span>
            </div>
            <div className="flex items-center gap-2 h-2">
                <div className="flex-1 flex justify-end bg-white/5 rounded-full h-full overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{ width: `${p1}%`, background: color, opacity: 0.7 }}
                    />
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex-1 flex justify-start bg-white/5 rounded-full h-full overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{ width: `${p2}%`, background: color }}
                    />
                </div>
            </div>
        </div>
    );
}

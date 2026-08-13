"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { LucideIcon, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { properties } from "@/lib/mockData"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
    defaultActive?: string
}

function Mascot({ interacting }: { interacting: boolean }) {
    return (
        <motion.div
            layoutId="anime-mascot"
            className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none"
            initial={false}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
        >
            <div className="relative w-12 h-12">
                <motion.div
                    className="absolute w-10 h-10 bg-white rounded-full left-1/2 -translate-x-1/2"
                    animate={
                        interacting ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0],
                            transition: {
                                duration: 0.5,
                                ease: "easeInOut"
                            }
                        } : {
                            y: [0, -3, 0],
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }
                    }
                >
                    <motion.div
                        className="absolute w-2 h-2 bg-black rounded-full"
                        animate={
                            interacting ? {
                                scaleY: [1, 0.2, 1],
                                transition: {
                                    duration: 0.2,
                                    times: [0, 0.5, 1]
                                }
                            } : {}
                        }
                        style={{ left: '25%', top: '40%' }}
                    />
                    <motion.div
                        className="absolute w-2 h-2 bg-black rounded-full"
                        animate={
                            interacting ? {
                                scaleY: [1, 0.2, 1],
                                transition: {
                                    duration: 0.2,
                                    times: [0, 0.5, 1]
                                }
                            } : {}
                        }
                        style={{ right: '25%', top: '40%' }}
                    />
                    <motion.div
                        className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
                        animate={{
                            opacity: interacting ? 0.8 : 0.6
                        }}
                        style={{ left: '15%', top: '55%' }}
                    />
                    <motion.div
                        className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
                        animate={{
                            opacity: interacting ? 0.8 : 0.6
                        }}
                        style={{ right: '15%', top: '55%' }}
                    />

                    <motion.div
                        className="absolute w-4 h-2 border-b-2 border-black rounded-full"
                        animate={
                            interacting ? {
                                scaleY: 1.5,
                                y: -1
                            } : {
                                scaleY: 1,
                                y: 0
                            }
                        }
                        style={{ left: '30%', top: '60%' }}
                    />
                    <AnimatePresence>
                        {interacting && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute -top-1 -right-1 w-2 h-2 text-yellow-300"
                                >
                                    ✨
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="absolute -top-2 left-0 w-2 h-2 text-yellow-300"
                                >
                                    ✨
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>
                <motion.div
                    className="absolute -bottom-1 left-1/2 w-4 h-4 -translate-x-1/2"
                    animate={
                        interacting ? {
                            y: [0, -4, 0],
                            transition: {
                                duration: 0.3,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }
                        } : {
                            y: [0, 2, 0],
                            transition: {
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }
                        }
                    }
                >
                    <div className="w-full h-full bg-white rotate-45 transform origin-center" />
                </motion.div>
            </div>
        </motion.div>
    )
}

export function AnimeNavBar({ items, className, defaultActive = "Home" }: NavBarProps) {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [hoveredTab, setHoveredTab] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>(defaultActive)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Sync activeTab with pathname
    useEffect(() => {
        const currentItem = items.find(item => pathname.startsWith(item.url) && item.url !== '/dashboard' || pathname === item.url);
        if (currentItem) {
            setActiveTab(currentItem.name);
        } else if (pathname === '/dashboard') {
            // Explicit check for Home/Dashboard root
            const homeItem = items.find(item => item.url === '/dashboard');
            if (homeItem) setActiveTab(homeItem.name);
        }
    }, [pathname, items]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    if (!mounted) return null

    return (
        <div className={cn("fixed top-5 left-0 right-0 z-[9999]", className)}>
            <div className="flex justify-center pt-6">
                <motion.div
                    className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg relative pointer-events-auto"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                    }}
                >
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.name
                        const isHovered = hoveredTab === item.name

                        return (
                            <Link
                                key={item.name}
                                href={item.url}
                                onClick={(e) => {
                                    setActiveTab(item.name)
                                }}
                                onMouseEnter={() => setHoveredTab(item.name)}
                                onMouseLeave={() => setHoveredTab(null)}
                                className={cn(
                                    "relative cursor-pointer text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300",
                                    "text-white/70 hover:text-white",
                                    isActive && "text-white"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: [0.3, 0.5, 0.3],
                                            scale: [1, 1.03, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-primary/25 rounded-full blur-md" />
                                        <div className="absolute inset-[-4px] bg-primary/20 rounded-full blur-xl" />
                                        <div className="absolute inset-[-8px] bg-primary/15 rounded-full blur-2xl" />
                                        <div className="absolute inset-[-12px] bg-primary/5 rounded-full blur-3xl" />

                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                                            style={{
                                                animation: "shine 3s ease-in-out infinite"
                                            }}
                                        />
                                    </motion.div>
                                )}

                                <motion.span
                                    className="hidden md:inline relative z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.name}
                                </motion.span>
                                <motion.span
                                    className="md:hidden relative z-10"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Icon size={18} strokeWidth={2.5} />
                                </motion.span>

                                <AnimatePresence>
                                    {isHovered && !isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                        />
                                    )}
                                </AnimatePresence>

                                {((hoveredTab === item.name) || (!hoveredTab && isActive && hoveredTab !== "Search")) && (
                                    <Mascot interacting={!!hoveredTab} />
                                )}
                            </Link>
                        )
                    })}

                    {/* Search Component */}
                    <div className="h-6 w-px bg-white/20 mx-2 hidden md:block" />
                    <SearchComponent hoveredTab={hoveredTab} setHoveredTab={setHoveredTab} />
                </motion.div>
            </div>
        </div>
    )
}


function SearchComponent({ hoveredTab, setHoveredTab }: { hoveredTab: string | null, setHoveredTab: (tab: string | null) => void }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Get unique cities from properties
    const cities = React.useMemo(() => {
        return Array.from(new Set(properties.map(p => p.city))).sort()
    }, [])

    useEffect(() => {
        const query = searchParams.get('city')
        if (query) {
            setSearchValue(query)
            setIsSearchOpen(true)
        }
    }, [searchParams])

    const handleSearch = (term: string) => {
        setSearchValue(term)
        if (term.trim()) {
            // Filter cities
            const filtered = cities.filter(c => c.toLowerCase().includes(term.toLowerCase()))
            setSuggestions(filtered)
            setShowSuggestions(true)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }

    const selectCity = (city: string) => {
        setSearchValue(city)
        setShowSuggestions(false)
        router.push(`/buyer?city=${encodeURIComponent(city)}`)
        setIsSearchOpen(false)
    }

    const clearSearch = () => {
        setSearchValue("")
        router.push('/buyer')
        setIsSearchOpen(false)
    }

    const isHovered = hoveredTab === "Search"

    return (
        <div className="relative flex items-center"
            onMouseEnter={() => setHoveredTab("Search")}
            onMouseLeave={() => setHoveredTab(null)}
        >
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 220, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="relative ml-2"
                    >
                        <div className="relative overflow-visible">
                            <input
                                placeholder="Search city..."
                                className="bg-white/10 border border-white/10 rounded-full text-white text-sm outline-none h-9 px-3 w-full placeholder:text-white/40"
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        selectCity(searchValue)
                                    }
                                }}
                                autoFocus
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                            {searchValue && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}

                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl z-50 max-h-60 overflow-y-auto"
                                    >
                                        {suggestions.map((city, i) => (
                                            <div
                                                key={i}
                                                className="px-4 py-2 text-sm text-white/80 hover:bg-white/10 cursor-pointer transition-colors"
                                                onClick={() => selectCity(city)}
                                            >
                                                {city}
                                                <span className="block text-[10px] text-white/30 uppercase tracking-wider">City</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 ml-1 relative"
            >
                {isSearchOpen ? <Search size={18} /> : <Search size={18} />}
                {isHovered && <Mascot interacting={true} />}
            </button>
        </div>
    )
}

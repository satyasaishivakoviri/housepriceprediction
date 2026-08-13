"use client";

import { motion } from "framer-motion";
import { StarButton } from '@/components/ui/star-button';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";

function FloatingPaths({ position }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position
            } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position
            } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position
            } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full text-white dark:text-white" viewBox="0 0 696 316" fill="none">
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({ title = "Your Smarter Home Advisor", showCta = true }) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden selection:bg-primary/30">
            <div className="absolute inset-0 z-0">
                {/* Global background handles paths now */}
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span key={wordIndex} className="inline-block mr-4 last:mr-0 text-white">
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: wordIndex * 0.1 + letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 30,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-neutral-100 to-neutral-400/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    {showCta && (
                        <Link href="/login">
                            <StarButton className="text-white">
                                <span className="flex items-center gap-2">
                                    <span className="font-bold tracking-tighter hidden md:inline-block">
                                        {"Find Your Home".split("").map((letter, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{
                                                    delay: index * 0.03,
                                                    type: "spring",
                                                    stiffness: 100,
                                                    damping: 30,
                                                }}
                                                className="inline-block"
                                            >
                                                {letter === " " ? "\u00A0" : letter}
                                            </motion.span>
                                        ))}
                                    </span>
                                    <span className="font-bold tracking-tighter md:hidden">Search</span>
                                    <motion.span
                                        initial={{ x: -10, y: 5, opacity: 0, rotate: -20 }}
                                        animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                                        transition={{
                                            delay: "Find Your Home".length * 0.03,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 30,
                                        }}
                                    >
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </motion.span>
                                </span>
                            </StarButton>
                        </Link>
                    )}


                </motion.div>
            </div >
        </div >
    );
}

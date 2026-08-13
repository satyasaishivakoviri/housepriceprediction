"use client";

import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

// Variants matching HeroGeometric style
const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            delay: 0.2 + i * 0.1,
            ease: [0.25, 0.4, 0.25, 1],
        },
    }),
};

export const FadeIn = ({ children, className, delay = 0, index = 0 }) => (
    <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariants}
        transition={{ delay: delay }}
        className={className}
    >
        {children}
    </motion.div>
);

export const PageWrapper = ({ children, className }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

// ── StaggerChildren: reveals children one-by-one ──
const staggerContainer = {
    hidden: {},
    visible: (stagger = 0.1) => ({
        transition: { staggerChildren: stagger, delayChildren: 0.1 },
    }),
};

const staggerItem = {
    hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    },
};

export const StaggerChildren = ({ children, className, stagger = 0.1 }) => (
    <motion.div
        custom={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className={className}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children, className }) => (
    <motion.div variants={staggerItem} className={className}>
        {children}
    </motion.div>
);

// ── CountUp: animates a number from 0 to target ──
export const CountUp = ({ target, suffix = "", prefix = "", duration = 2, className }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [display, setDisplay] = useState(`${prefix}0${suffix}`);

    useEffect(() => {
        if (!isInView) return;

        // Parse numeric value from target
        const numStr = String(target).replace(/[^0-9.]/g, "");
        const end = parseFloat(numStr);
        if (isNaN(end)) {
            setDisplay(`${prefix}${target}${suffix}`);
            return;
        }

        const startTime = performance.now();
        const durationMs = duration * 1000;

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * end);

            // Preserve formatting (e.g. "1k+" → keep suffix from target)
            const formatted = String(target).replace(numStr, String(current));
            setDisplay(`${prefix}${formatted}${suffix}`);

            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [isInView, target, suffix, prefix, duration]);

    return <span ref={ref}>{display}</span>;
};

// ── ActiveFocus: dims section when not in center of viewport ──
export const ActiveFocus = ({ children, className }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // Map scroll: 0 (entering) → 0.3 (center) → 0.7 (center) → 1 (leaving)
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0.35, 0.7, 1, 1, 0.7, 0.35]);
    const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

    return (
        <motion.div ref={ref} style={{ opacity: smoothOpacity }} className={className}>
            {children}
        </motion.div>
    );
};

// ── PulseGlow: subtle pulsing wrapper for CTAs ──
export const PulseGlow = ({ children, className }) => (
    <motion.div
        className={`relative ${className || ""}`}
        whileInView={{
            boxShadow: [
                "0 0 0px 0px rgba(239,68,68,0)",
                "0 0 20px 4px rgba(239,68,68,0.15)",
                "0 0 0px 0px rgba(239,68,68,0)",
            ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        viewport={{ once: false }}
        style={{ borderRadius: "inherit" }}
    >
        {children}
    </motion.div>
);

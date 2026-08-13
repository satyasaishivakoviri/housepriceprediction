
import * as React from "react";
import { motion, Variants, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
    text: React.ReactNode;
    textClassName?: string;
    underlineClassName?: string;
    underlinePath?: string;
    underlineHoverPath?: string;
    underlineDuration?: number;
    enableScrollAnimation?: boolean;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
    (
        {
            text,
            textClassName,
            underlineClassName,
            underlinePath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10",
            underlineHoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10",
            underlineDuration = 1.5,
            enableScrollAnimation = false,
            ...props
        },
        ref
    ) => {
        const { scrollY } = useScroll();
        // Scroll Down (scrollY increases) -> Width shrinks (scaleX -> 0)
        // Scroll Up (scrollY decreases) -> Width expands (scaleX -> 1)
        // This creates the "expand to right" effect when scrolling up.
        const scaleX = useTransform(scrollY, [0, 300], [1, 0]);
        const springScaleX = useSpring(scaleX, { stiffness: 50, damping: 20 });

        const pathVariants: Variants = {
            hidden: {
                pathLength: 0,
                opacity: 0,
            },
            visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                    duration: underlineDuration,
                    ease: "easeInOut",
                },
            },
        };

        return (
            <div
                ref={ref}
                className={cn("flex flex-col items-center justify-center gap-2", props.className)}
            >
                <div className="relative">
                    <motion.h1
                        className={cn("text-4xl font-bold text-center", textClassName)}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {text}
                    </motion.h1>

                    <motion.svg
                        style={{
                            scaleX: enableScrollAnimation ? springScaleX : 1,
                            transformOrigin: "left"
                        }}
                        width="100%"
                        height="20"
                        viewBox="0 0 300 20"
                        className={cn("absolute -bottom-4 left-0 text-primary w-full", underlineClassName)}
                    >
                        <motion.path
                            d={underlinePath}
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            variants={pathVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{
                                d: underlineHoverPath,
                                transition: { duration: 0.8 },
                            }}
                        />
                    </motion.svg>
                </div>
            </div>
        );
    }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };

"use client";

import * as React from "react";
import { useState, useId, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { Meteors } from "../ui/meteors";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface TypewriterProps {
    text: string | string[];
    speed?: number;
    cursor?: string;
    loop?: boolean;
    deleteSpeed?: number;
    delay?: number;
    className?: string;
}

export function Typewriter({
    text,
    speed = 100,
    cursor = "|",
    loop = false,
    deleteSpeed = 50,
    delay = 1500,
    className,
}: TypewriterProps) {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [textArrayIndex, setTextArrayIndex] = useState(0);

    const textArray = Array.isArray(text) ? text : [text];
    const currentText = textArray[textArrayIndex] || "";

    useEffect(() => {
        if (!currentText) return;

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    if (currentIndex < currentText.length) {
                        setDisplayText((prev) => prev + currentText[currentIndex]);
                        setCurrentIndex((prev) => prev + 1);
                    } else if (loop) {
                        setTimeout(() => setIsDeleting(true), delay);
                    }
                } else {
                    if (displayText.length > 0) {
                        setDisplayText((prev) => prev.slice(0, -1));
                    } else {
                        setIsDeleting(false);
                        setCurrentIndex(0);
                        setTextArrayIndex((prev) => (prev + 1) % textArray.length);
                    }
                }
            },
            isDeleting ? deleteSpeed : speed,
        );

        return () => clearTimeout(timeout);
    }, [
        currentIndex,
        isDeleting,
        currentText,
        loop,
        speed,
        deleteSpeed,
        delay,
        displayText,
        text,
    ]);

    return (
        <span className={className}>
            {displayText}
            <span className="animate-pulse">{cursor}</span>
        </span>
    );
}

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input dark:border-input/50 bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary-foreground/60 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-md px-6",
                icon: "h-8 w-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} suppressHydrationWarning {...props} />;
    }
);
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                suppressHydrationWarning
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, label, ...props }, ref) => {
        const id = useId();
        const [showPassword, setShowPassword] = useState(false);
        const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
        return (
            <div className="grid w-full items-center gap-2">
                {label && <Label htmlFor={id}>{label}</Label>}
                <div className="relative">
                    <Input id={id} type={showPassword ? "text" : "password"} className={cn("pe-10", className)} ref={ref} {...props} />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? (<EyeOff className="size-4" aria-hidden="true" />) : (<Eye className="size-4" aria-hidden="true" />)}
                    </button>
                </div>
            </div>
        );
    }
);
// ... imports

// ... (other code)

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    type?: "default" | "success";
}

function AuthModal({ isOpen, onClose, title, message, actionLabel, onAction, type = "default" }: AuthModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center"
                    >
                        {type === "success" && (
                            <div className="mb-4 rounded-full bg-green-500/20 p-3">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                        )}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-zinc-400 text-sm mb-6">{message}</p>
                            {actionLabel && onAction && (
                                <div className="grid gap-3">
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            onAction();
                                            onClose();
                                        }}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                                    >
                                        {actionLabel}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        className="w-full text-zinc-500 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function SignInFormContent({ onToggle }: { onToggle: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    const [showMissingModal, setShowMissingModal] = useState(false);

    // Listen for Google Redirect errors or success messages
    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'account_missing') {
            setShowMissingModal(true);
        }

        const msg = searchParams.get('message');
        if (msg) {
            setToastMessage(msg);
            setToastType("success");
            setShowToast(true);
            // Hide toast after 3s
            setTimeout(() => setShowToast(false), 3000);
        }

        // Handle Google Login Success
        if (searchParams.get('login_success') === 'true') {
            localStorage.setItem('isLoggedIn', 'true');
            setToastMessage("Login Successful");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        }
    }, [searchParams]);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.code === 'account_missing') {
                    setShowMissingModal(true);
                    return;
                }
                throw new Error(data.error || "Login failed");
            }

            // Success! Token is in HTTP-only cookie
            localStorage.setItem('isLoggedIn', 'true');
            setToastMessage("Login Successful");
            setToastType("success");
            setShowToast(true);

            // Professional delay before opening dashboard
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSignIn} autoComplete="on" className="flex flex-col gap-8">
                {/* ... existing form content ... */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Sign in to HomieNest</h1>
                    <p className="text-balance text-sm text-muted-foreground">Welcome back to your smart home journey</p>
                </div>

                {error && (
                    <div className="bg-destructive/15 text-destructive text-xs p-3 rounded-lg border border-destructive/20">
                        {error}
                    </div>
                )}

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required autoComplete="email" />
                    </div>
                    <PasswordInput name="password" label="Password" required autoComplete="current-password" placeholder="Password" />
                    <Button type="submit" variant="default" className="mt-2 w-full" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </div>
            </form>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-zinc-900 border border-white/10 text-white rounded-full px-6 py-3 shadow-2xl"
                    >
                        <div className="bg-green-500/20 p-1 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="text-sm font-medium">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthModal
                isOpen={showMissingModal}
                onClose={() => setShowMissingModal(false)}
                title="Account Not Found"
                message="Account does not exist, please sign up."
                actionLabel="Go to Sign Up"
                onAction={() => {
                    onToggle();
                }}
            />
        </>
    );
}

function SignInForm(props: { onToggle: () => void }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInFormContent {...props} />
        </Suspense>
    );
}

function SignUpForm({ onToggle }: { onToggle: () => void }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showExistModal, setShowExistModal] = useState(false);

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.code === 'account_exists') {
                    setShowExistModal(true);
                    return;
                }
                throw new Error(data.error || "Account creation failed");
            }

            // Success -> Redirect to login with success message
            onToggle(); // Switch to sign in view
            // Or use router.push if they are on separate pages, 
            // but since it's a unified component, onToggle is cleaner.
            // If the user specifically wants the login PAGE:
            router.push("/login?message=Account Created Successfully");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSignUp} autoComplete="on" className="flex flex-col gap-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-balance text-sm text-muted-foreground">Start your real estate journey today</p>
                </div>

                {error && (
                    <div className="bg-destructive/15 text-destructive text-xs p-3 rounded-lg border border-destructive/20">
                        {error}
                    </div>
                )}

                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" type="text" placeholder="John Doe" required autoComplete="name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required autoComplete="email" />
                    </div>
                    <PasswordInput name="password" label="Password" required autoComplete="new-password" placeholder="Create a strong password" />
                    <Button type="submit" variant="default" className="mt-2 w-full" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </div>
            </form>

            <AuthModal
                isOpen={showExistModal}
                onClose={() => setShowExistModal(false)}
                title="Account Already Exists"
                message="User already exists, please log in."
                actionLabel="Go to Log In"
                onAction={() => {
                    onToggle();
                }}
            />
        </>
    );
}

function AuthFormContainer({ isSignIn, onToggle }: { isSignIn: boolean; onToggle: () => void; }) {
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        const mode = isSignIn ? 'login' : 'signup';
        try {
            const res = await fetch(`/api/auth/google/url?mode=${mode}`);
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No Google URL returned");
            }
        } catch (err) {
            console.error("Google Auth Error:", err);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
            <div className="mx-auto grid w-full gap-6">
                {isSignIn ? <SignInForm onToggle={onToggle} /> : <SignUpForm onToggle={onToggle} />}
                <div className="text-center text-sm">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                    <Button variant="link" className="pl-1 text-primary p-0 h-auto font-bold" onClick={onToggle}>
                        {isSignIn ? "Sign up" : "Sign in"}
                    </Button>
                </div>
                <div className="text-center text-sm my-4">
                    <span className="text-muted-foreground">Or continue with</span>
                </div>
                <Button
                    variant="outline"
                    type="button"
                    disabled={googleLoading}
                    onClick={handleGoogleLogin}
                    className="w-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white"
                >
                    {googleLoading ? (
                        "Connecting..."
                    ) : (
                        <>
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" className="mr-2 h-4 w-4" />
                            Continue with Google
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

interface AuthContentProps {
    image?: {
        src: string;
        alt: string;
    };
    quote?: {
        text: string;
        author: string;
    }
}

interface AuthUIProps {
    initialView?: "signin" | "signup";
    signInContent?: AuthContentProps;
    signUpContent?: AuthContentProps;
}

const defaultSignInContent = {
    image: {
        src: "https://images.unsplash.com/photo-1600596542815-a67992989d7f?q=80&w=2072&auto=format&fit=crop", // Modern Villa
        alt: "Modern Dream Home"
    },
    quote: {
        text: "Finding your dream home is just the beginning.",
        author: "HomieNest AI"
    }
};

const defaultSignUpContent = {
    image: {
        src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop", // Keys/Handover
        alt: "Keys to your new home"
    },
    quote: {
        text: "Join the future of real estate decision making.",
        author: "HomieNest AI"
    }
};



const signInImages = [
    { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop", alt: "Modern Villa" }, // Changed to a more reliable URL
    { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200", alt: "Luxury Interior" },
    { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200", alt: "Poolside View" },
];

const signUpImages = [
    { src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200", alt: "Keys Handover" },
    { src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200", alt: "New Home Keys" },
    { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200", alt: "Real Estate Agent" },
];

export function AuthUI({ initialView = "signin", signInContent = {}, signUpContent = {} }: AuthUIProps) {
    const [isSignIn, setIsSignIn] = useState(initialView === "signin");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Sync state if prop changes
    useEffect(() => {
        setIsSignIn(initialView === "signin");
    }, [initialView]);

    // Slideshow effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % (isSignIn ? signInImages.length : signUpImages.length));
        }, 5000);
        return () => clearInterval(interval);
    }, [isSignIn]); // Reset interval when switching modes

    // Reset index when switching modes to start fresh
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [isSignIn]);

    const toggleForm = () => setIsSignIn((prev) => !prev);

    // Use arrays instead of single default content objects for images, but keep quotes logic
    const currentImages = isSignIn ? signInImages : signUpImages;
    const currentQuote = isSignIn
        ? { ...defaultSignInContent.quote, ...signInContent.quote }
        : { ...defaultSignUpContent.quote, ...signUpContent.quote };

    const activeImage = currentImages[currentImageIndex];

    return (
        <div className="relative w-full min-h-screen bg-black text-foreground overflow-hidden font-sans">
            <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        @keyframes comet {
            0% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
            100% { transform: translateX(-500px) translateY(500px) scale(0); opacity: 0; }
        }
        .animate-comet {
            animation: comet 3s ease-in-out infinite;
        }
      `}</style>

            {/* Global Stars & Comets Background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Static Stars */}
                <div className="absolute h-[2px] w-[2px] bg-white rounded-full top-1/4 left-1/4 animate-pulse"></div>
                <div className="absolute h-[3px] w-[3px] bg-white/60 rounded-full top-1/3 right-1/4 animate-pulse delay-75"></div>
                <div className="absolute h-[1px] w-[1px] bg-white/80 rounded-full bottom-1/3 left-1/3 animate-pulse delay-150"></div>
                <div className="absolute h-[2px] w-[2px] bg-white/40 rounded-full top-10 right-10 animate-pulse delay-300"></div>
                <div className="absolute h-[1px] w-[1px] bg-white/90 rounded-full bottom-10 right-1/3 animate-pulse delay-500"></div>
                <div className="absolute h-[2px] w-[2px] bg-white/50 rounded-full top-1/2 left-10 animate-pulse delay-200"></div>
                <div className="absolute h-[2px] w-[2px] bg-white/70 rounded-full bottom-20 left-20 animate-pulse delay-700"></div>
                <div className="absolute h-[3px] w-[3px] bg-white/40 rounded-full top-20 left-1/2 animate-pulse delay-1000"></div>

                {/* Comets/Shooting Stars */}
                <Meteors number={30} />
            </div>

            <div className="relative z-10 w-full min-h-screen md:grid md:grid-cols-2">
                <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12 bg-transparent">
                    <AuthFormContainer isSignIn={isSignIn} onToggle={toggleForm} />
                </div>

                <div className="hidden md:flex relative w-full h-full items-center justify-center overflow-hidden">
                    {/* Floating Image Slideshow */}
                    <div className="relative z-10 animate-float w-full max-w-[400px] h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImage.src}
                                src={activeImage.src}
                                alt={activeImage.alt}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.8 }}
                                referrerPolicy="no-referrer"
                                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl border border-white/10"
                            />
                        </AnimatePresence>
                    </div>

                    {/* Quote */}
                    <div className="absolute bottom-10 max-w-lg text-center px-4">
                        <p className="text-xl md:text-2xl font-light text-white mb-4">
                            “<Typewriter
                                key={currentQuote.text}
                                text={currentQuote.text}
                                speed={40}
                            />”
                        </p>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">
                            — {currentQuote.author}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

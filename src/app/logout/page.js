"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            // 1. Call API to clear cookie
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch (e) {
                console.error('Logout failed', e);
            }

            // 2. Clear local storage
            localStorage.removeItem('isLoggedIn');

            // 3. Hard redirect to login to ensure fresh state
            window.location.href = '/login';
        };

        performLogout();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60 text-sm tracking-widest uppercase">Signing out...</p>
            </div>
        </div>
    );
}

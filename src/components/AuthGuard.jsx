"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [optimisticAuth, setOptimisticAuth] = useState(false);

    useEffect(() => {
        // Optimistically show UI if logged in previously
        if (localStorage.getItem('isLoggedIn') === 'true') {
            setOptimisticAuth(true);
        }

        async function checkAuth() {
            try {
                // Prevent caching of auth status
                const res = await fetch('/api/auth/me', {
                    cache: 'no-store',
                    headers: { 'Pragma': 'no-cache' }
                });
                if (res.ok) {
                    setAuthorized(true);
                    setOptimisticAuth(true);
                    localStorage.setItem('isLoggedIn', 'true');
                } else {
                    localStorage.removeItem('isLoggedIn');
                    setOptimisticAuth(false);
                    router.push('/login');
                }
            } catch (error) {
                console.error('Auth Guard Error:', error);
                localStorage.removeItem('isLoggedIn');
                setOptimisticAuth(false);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, [router]);

    // Only show giant blocking spinner if NOT optimistically authenticated
    if (loading && !optimisticAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!authorized && !optimisticAuth) return null;

    return <>{children}</>;
}

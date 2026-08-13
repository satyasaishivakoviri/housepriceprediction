"use client";
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { AnimatedBackgroundPaths } from '@/components/ui/animated-background-paths';
import { GlassOverlay } from '@/components/ui/glass-overlay';
import { GlobalBackButton } from '@/components/ui/global-back-button';
import { GlobalUserProfile } from '@/components/ui/global-user-profile';
import FooterWrapper from '@/components/FooterWrapper';
import Script from 'next/script';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isSomerstone = pathname?.startsWith('/somerstone');

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {!isSomerstone && <AnimatedBackgroundPaths />}

            {!isSomerstone && <GlassOverlay />}

            {!isSomerstone && <GlobalBackButton />}
            {!isSomerstone && <GlobalUserProfile />}

            <main className="min-h-screen">
                {children}
            </main>

            {!isSomerstone && <FooterWrapper />}

            {/* Load legacy scripts - maybe keep for global functionality or exclude for Somerstone if they conflict */}
            {!isSomerstone && (
                <>
                    <Script src="/js/real-estate-data.js" strategy="beforeInteractive" />
                    <Script src="/js/mobile-menu.js" strategy="lazyOnload" />
                </>
            )}
        </ThemeProvider>
    );
}

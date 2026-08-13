import FooterWrapper from '@/components/FooterWrapper';
import Script from 'next/script';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata = {
    title: 'HomieNest - AI-Powered Real Estate',
    description: 'India\'s most accurate platform for real-time house price forecasting, neighborhood analytics, and premium blue-chip property investment insights.',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "HomieNest",
    },
};

export const viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

import { ThemeProvider } from '@/components/theme-provider';

import { AnimatedBackgroundPaths } from '@/components/ui/animated-background-paths';
import { GlassOverlay } from '@/components/ui/glass-overlay';
import { GlobalBackButton } from '@/components/ui/global-back-button';
import { GlobalUserProfile } from '@/components/ui/global-user-profile';

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
            <head>
                <link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700,800,900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Anton&family=DotGothic16&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Racing+Sans+One&display=swap" rel="stylesheet" />
            </head>

            <body className="font-display text-navy transition-colors duration-300">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >

                    <AnimatedBackgroundPaths />

                    <GlassOverlay />

                    <GlobalBackButton />
                    <GlobalUserProfile />

                    <main className="min-h-screen">
                        {children}
                    </main>

                    <FooterWrapper />

                    {/* Load legacy scripts */}
                    <Script src="/js/real-estate-data.js" strategy="beforeInteractive" />
                    <Script src="/js/mobile-menu.js" strategy="lazyOnload" />
                </ThemeProvider>
            </body>
        </html>
    );
}

import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                listings: resolve(__dirname, 'pages/listings.html'),
                predictor: resolve(__dirname, 'pages/predictor.html'),
                analytics: resolve(__dirname, 'pages/analytics.html'),
                about: resolve(__dirname, 'pages/about.html'),
                login: resolve(__dirname, 'pages/login.html'),
                legal: resolve(__dirname, 'pages/legal.html'),
                locationInsights: resolve(__dirname, 'pages/location-based_price_insights.html')
            }
        }
    }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@ui': path.resolve(__dirname, './src/components/ui'),
            '@lib': path.resolve(__dirname, './src/lib'),

            // اختياري: إذا تحب تحافظ على aliases للباكدجات القديمة
            'vaul@1.1.2': 'vaul',
            'sonner@2.0.3': 'sonner',
            'recharts@2.15.2': 'recharts',
            'react-resizable-panels@2.1.7': 'react-resizable-panels',
            'react-hook-form@7.55.0': 'react-hook-form',
            'react-day-picker@8.10.1': 'react-day-picker',
            'next-themes@0.4.6': 'next-themes',
            'lucide-react@0.487.0': 'lucide-react',
            'input-otp@1.4.2': 'input-otp',
            'embla-carousel-react@8.6.0': 'embla-carousel-react',
            'cmdk@1.1.1': 'cmdk',
            'class-variance-authority@0.7.0': 'class-variance-authority',
        },
    },
    build: {
        target: 'esnext',
        outDir: 'build',
    },
    server: {
        port: 3000,
        open: true,
    },
});
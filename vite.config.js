import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/main.jsx'],
            refresh: true,
        }),
    ],
    esbuild: {
        loader: 'jsx',
        include: /resources\/js\/.*\.jsx$/,
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.jsx': 'jsx',
            },
        },
    },
});
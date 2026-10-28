import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/** @see https://vitejs.dev/config */
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        watch: {
            usePolling: true,
            ignored: ['**/.pnpm-store/**'],
        },
        host: true,
        strictPort: true,
        port: 5173,
    },
});

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const certPath = new URL('./.certs/localhost.pem', import.meta.url);
const keyPath = new URL('./.certs/localhost-key.pem', import.meta.url);
const hasLocalCertificate = existsSync(certPath) && existsSync(keyPath);

/** @see https://vitejs.dev/config */
export default defineConfig({
    plugins: [react(), tsconfigPaths(), ...(!hasLocalCertificate ? [basicSsl()] : [])],
    server: {
        watch: {
            usePolling: true,
            ignored: ['**/.pnpm-store/**'],
        },
        host: true,
        https: hasLocalCertificate ? {
            cert: readFileSync(certPath),
            key: readFileSync(keyPath),
        } : {},
        strictPort: true,
        port: 5173,
    },
});

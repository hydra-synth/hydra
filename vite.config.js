import { defineConfig } from 'vite'

export default defineConfig({
    // define: { global: {} },
    base: '',
    define: {
        'process.env': {}
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            }
        }
    }
})
import { defineConfig } from 'vite'

export default defineConfig({
    //define: { global: {} },
    base: '/hydra/',
    define: {
        'process.env': {},
        // 'global.window': 'window'
        // global: {}
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            }
        }
    }
})
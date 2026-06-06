import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [{
        name: 'file-route-fallback',
        configureServer(server) {
            // Serve index.html for /f/:filename routes so the SPA can handle them.
            // The dot in filenames (e.g. hello.txt) bypasses Vite's built-in
            // history fallback, so we intercept early here instead.
            server.middlewares.use((req, res, next) => {
                if (req.url && req.url.startsWith('/f/')) {
                    req.url = '/index.html'
                }
                next()
            })
        }
    }],
    base: '',
    define: {
        'process.env': {},
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            }
        }
    }
})

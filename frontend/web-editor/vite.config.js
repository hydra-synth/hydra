import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  root: 'src',
  define: {
    // fix for hydra-synth
    global: {
      window: {}
    }
  },
  build: {
    minify: false,
    outDir: "../public",
    commonjsOptions: {
    }
  },
  server: {
    host:"0.0.0.0",
    port:3000,
    strictPort: true,
    hmr: {
      clientPort: 443 // Run the websocket server on the SSL port
    }
  }
});

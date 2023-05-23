import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  const commonConfig = {
    plugins: [],
    root: 'src',
    build: {
      minify: false,
      outDir: "../public",
      commonjsOptions: {
        format: "cjs"
      }
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      hmr: {
        clientPort: 443 // Run the websocket server on the SSL port
      }
    }
  };
  if (command === 'serve') {
    return {
      ...commonConfig,
      define: {
        // fix for hydra-synth
        global: "window"
      },  
    }
  } else {
    // command === 'build'
    return {
      ...commonConfig
    }
  }
})

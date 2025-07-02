import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import polyfillNode from "rollup-plugin-polyfill-node"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  // Rollup/Vite build-time polyfills for Node globals used by some deps
  define: {
    "process.env": {}, // prevents `process is not defined`
    global: "window", // some libs check for `global`
    Buffer: "null", // avoid Buffer import if referenced
  },
  build: {
    rollupOptions: {
      plugins: [
        // Shims `process`, `Buffer`, `global`, etc. for browser builds
        polyfillNode(),
      ],
    },
  },
})

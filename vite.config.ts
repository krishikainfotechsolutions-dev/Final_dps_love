import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    // Raise inline threshold so tiny assets get inlined (saves round-trips)
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Split vendor chunks for better long-term caching
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-framer": ["framer-motion"],
          "vendor-lightbox": ["yet-another-react-lightbox"],
        },
      },
    },
  },
}));

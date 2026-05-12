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
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    // Raise chunk size warning to 600KB (recharts is naturally large)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Charts — large, only used in admin/analytics pages
          if (id.includes("recharts") || id.includes("d3-")) {
            return "charts";
          }
          // Radix UI primitives — large set of packages
          if (id.includes("@radix-ui")) {
            return "radix-ui";
          }
          // Core React runtime
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "react-vendor";
          }
          // Routing
          if (id.includes("react-router") || id.includes("@remix-run")) {
            return "router";
          }
          // Supabase client
          if (id.includes("@supabase")) {
            return "supabase";
          }
          // Tanstack Query
          if (id.includes("@tanstack")) {
            return "query";
          }
          // Lucide icons — tree-shakeable but still worth isolating
          if (id.includes("lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Run: ANALYZE=true npm run build  to open bundle stats
    process.env.ANALYZE === "true" && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "dist/stats.html",
    }),
  ].filter(Boolean),

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },

  build: {
    chunkSizeWarningLimit: 600,
    // Minify with esbuild (faster than terser, similar output size)
    minify: "esbuild",
    rollupOptions: {
      output: {
        // Keep asset names stable for CDN caching
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks(id) {
          // ── Charts (recharts + d3) ────────────────────────────────────────
          if (id.includes("recharts") || id.includes("d3-")) return "charts";

          // ── Radix UI: split by usage profile ─────────────────────────────
          // Primitives: only Slot + compose-refs — tiny, used by Button on every page
          if (
            id.includes("@radix-ui/react-slot") ||
            id.includes("@radix-ui/react-compose-refs")
          ) return "radix-primitives";

          // Form controls: Select (352kB!), Checkbox, Label, RadioGroup, Switch
          if (
            id.includes("@radix-ui/react-select") ||
            id.includes("@radix-ui/react-checkbox") ||
            id.includes("@radix-ui/react-label") ||
            id.includes("@radix-ui/react-radio-group") ||
            id.includes("@radix-ui/react-switch") ||
            id.includes("@radix-ui/react-slider")
          ) return "radix-forms";

          // Overlay: Dialog, Dropdown, Popover, ContextMenu, HoverCard, AlertDialog
          if (
            id.includes("@radix-ui/react-dialog") ||
            id.includes("@radix-ui/react-dropdown-menu") ||
            id.includes("@radix-ui/react-popover") ||
            id.includes("@radix-ui/react-context-menu") ||
            id.includes("@radix-ui/react-hover-card") ||
            id.includes("@radix-ui/react-alert-dialog")
          ) return "radix-overlay";

          // Navigation + layout
          if (
            id.includes("@radix-ui/react-navigation-menu") ||
            id.includes("@radix-ui/react-tabs") ||
            id.includes("@radix-ui/react-accordion") ||
            id.includes("@radix-ui/react-collapsible") ||
            id.includes("@radix-ui/react-scroll-area") ||
            id.includes("@radix-ui/react-separator") ||
            id.includes("@radix-ui/react-aspect-ratio") ||
            id.includes("@radix-ui/react-menubar")
          ) return "radix-layout";

          // Feedback: Toast, Tooltip, Progress
          if (
            id.includes("@radix-ui/react-toast") ||
            id.includes("@radix-ui/react-tooltip") ||
            id.includes("@radix-ui/react-progress") ||
            id.includes("@radix-ui/react-toggle")
          ) return "radix-feedback";

          // Anything remaining @radix-ui
          if (id.includes("@radix-ui")) return "radix-misc";

          // ── Core React runtime ────────────────────────────────────────────
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) return "react-vendor";

          // ── Routing ───────────────────────────────────────────────────────
          if (id.includes("react-router") || id.includes("@remix-run")) return "router";

          // ── Supabase client (intentionally NOT in a manual chunk)  ────────
          // use-tools.ts now uses dynamic import() so supabase is only fetched
          // after the first query runs — not on the critical rendering path.
          // Keeping it as a separate chunk still helps with caching.
          if (id.includes("@supabase")) return "supabase";

          // ── TanStack Query ────────────────────────────────────────────────
          if (id.includes("@tanstack")) return "query";

          // ── Lucide icons ──────────────────────────────────────────────────
          if (id.includes("lucide-react")) return "icons";

          // ── date-fns / dayjs (if used) ────────────────────────────────────
          if (id.includes("date-fns") || id.includes("dayjs")) return "date";
        },
      },
    },
  },
}));

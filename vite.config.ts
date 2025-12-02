import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
const postcss = require("./postcss.config.js");

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss, 
  },
}));

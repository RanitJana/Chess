import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    mimeTYpes: {
      ".wasm": "application/wasm",
    },
    open: true, // Automatically open the browser on start
  },
});

import { defineConfig } from "vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

const ReactCompilerConfig = {};
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: "react",
      //   autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
    babel({
      presets: [reactCompilerPreset(ReactCompilerConfig)],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/blog-graphql": {
        target: "https://blog.geoplox.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/blog-graphql$/, "/graphql"),
      },
    },
  },
});

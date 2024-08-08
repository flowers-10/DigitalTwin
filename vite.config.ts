import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import glsl from "vite-plugin-glsl"; // vite扩展glsl语言
import tailwindcss from "tailwindcss"; // 导入tailwindcss

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.mp3", "**/*.ico","**/*.svg"],
  server: {
    port: 9712,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@hook": path.resolve(__dirname, "src/hook"),
      "@core": path.resolve(__dirname, "src/core"),
      "@shaders": path.resolve(__dirname, "src/shaders"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
  plugins: [
    vue(),
    glsl({
      compress: true,
      watch: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});

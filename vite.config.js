import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "cesiumStatic";

export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
  },
  resolve: {
    alias: {
      Sandcastle: resolve(root, "runner/Sandcastle.js"),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
      ],
    }),
  ],
  optimizeDeps: {
    entries: [
      "index.html",
      "viewer.html",
      "runner/app.js",
      "runner/boot.js",
    ],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        viewer: resolve(root, "viewer.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: "/",
    proxy: {
      "/SampleData": {
        target: "https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps",
        changeOrigin: true,
        bypass(req) {
          const urlPath = (req.url ?? "").split("?")[0];
          const local = resolve(root, `.${urlPath}`);
          if (existsSync(local)) {
            return urlPath;
          }
        },
      },
    },
  },
});

import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
    base: "./",
    plugins: [cloudflare()],
    server: {
        host: "localhost",
        cors: {
            origin: "*",
        },
        port: 5173,
        hmr: {
            host: "localhost",
            protocol: "ws",
        },
    },
    build: {
        minify: true,
        manifest: true,
        outDir: "dist",
        assetsDir: "assets",
        rollupOptions: {
            input: {
                main: "./src/main.ts",
            },
            output: {
                format: "es",
                name: "pxm-site-script",
                entryFileNames: "main.js",
                chunkFileNames: "assets/[name].[hash].js",
                assetFileNames: "assets/[name].[hash][extname]",
                compact: true,
                globals: {
                    jquery: "$",
                },
            },
            external: ["jquery"],
        },
        modulePreload: {
            polyfill: true,
        }
    },
});
import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
// import pageReload from 'vite-plugin-page-reload';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  publicDir: 'public',
  plugins: [
    shopify({
      sourceCodeDir: 'src',
      themeHotReload: true,
    }),
    // pageReload('/tmp/theme.update', {
    //   delay: 2000,
    // }),
    tailwindcss(),
    cloudflare(),
  ],
  server: {
    cors: {
      origin: [
        /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
        'https://pxmdev.myshopify.com',
        'https://pxmdev.com',
      ],
    },
  },
  build: {
    emptyOutDir: false,
  },
});

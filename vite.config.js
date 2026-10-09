import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Inlines the entry stylesheet into index.html at build time so the browser doesn't
// wait on an extra render-blocking request before first paint. Dev server is untouched.
function inlineEntryCss() {
  return {
    name: 'inline-entry-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx || !ctx.bundle) return html;
        return html.replace(/<link rel="stylesheet"[^>]*?href="(\/[^"]+\.css)"[^>]*>/g, (tag, href) => {
          const asset = ctx.bundle[href.replace(/^\//, '')];
          if (!asset || asset.type !== 'asset') return tag;
          return `<style>${String(asset.source)}</style>`;
        });
      },
    },
  };
}

export default defineConfig({
   server: {
     host: true, // Listens on all local IP addresses
   },
  plugins: [react(), tailwindcss(), inlineEntryCss()],
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Third-party code is split off so a change to VeriPath's own source
          // does not invalidate React and Motion in everyone's cache.
          //
          // All of node_modules goes into ONE chunk on purpose. Splitting it
          // further (react / motion / vendor) put mutually-dependent packages
          // on opposite sides of a chunk boundary — `framer-motion` in vendor
          // but `motion-dom` in motion, `react-dom` in react but `scheduler`
          // in vendor — which produced circular chunks. A circular ESM chunk
          // graph has no valid evaluation order, so Motion's class components
          // ran `extends React.Component` before the React chunk had
          // initialized its exports, and the page died at load with
          // "Cannot read properties of undefined (reading 'Component')".
          // A single vendor chunk cannot cycle: nothing in node_modules
          // imports application source.
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

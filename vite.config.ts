import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'globalThis'
  },
  plugins: [
    vue()
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    }
  },
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: /(use-globalThis-config)/g, replacement: 'use-global-config' },
      { find: /(use-prevent-globalThis)/g, replacement: 'use-prevent-global' },
      { find: /(globalThis-node)/g, replacement: 'global-node' },
    ]
  },
})
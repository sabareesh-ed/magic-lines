import { defineConfig } from 'vite';
import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    glsl(),
  ],

  server: {
    host: 'localhost',
    cors: '*',
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },

  build: {
    minify: true,
    manifest: true,
    rollupOptions: {
      // Define multiple entry points
      input: {
        main: resolve(__dirname, 'src/main.js'),
        gsap: resolve(__dirname, 'src/gsap.js'),
      },
      output: {
        format: 'umd',
        // Use [name] to preserve entry filenames (main.js, gsap.js)
        entryFileNames: '[name].js',
        esModule: false,
        compact: true,
        globals: {
          jquery: '$',
        },
      },
      external: [
        'jquery',
      ],
    },
  },
});

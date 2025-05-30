import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
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
      // Multiple entry points
      input: {
        main: './src/main.js',
        aboutUs: './src/aboutUs.js',
        mindset: './src/mindset.js',
        stats: './src/stats.js',
      },
      // Avoid specifying 'umd' format for multiple inputs; let Vite handle the output format
      // If you want to specify output options, do it like this:
      output: {
        entryFileNames: '[name].js', // output filenames will be main.js, aboutUs.js, etc.
        // esModule: false, // usually not needed unless you want to disable ES module output
        compact: true,
        globals: {
          jquery: '$',
        },
      },
      external: ['jquery'],
    },
  },
});

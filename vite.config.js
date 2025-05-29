import { defineConfig } from 'vite'
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
      input: {
        main: './src/main.js',
        aboutUs: './src/about-us.js',  // add your other entry point here
      },
      output: {
        format: 'umd',
        entryFileNames: '[name].js', // use [name] placeholder to keep file names
        esModule: false,
        compact: true,
        globals: {
          jquery: '$',
        },
      },
      external: ['jquery'],
    },
  },
})

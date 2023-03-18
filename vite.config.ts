import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    // https: true
  },
  optimizeDeps: {
    // esbuildOptions: {
    //   plugins: [
    //     esbuildCommonjs(['@tensorflow/tfjs-backend-webgl', '@tensorflow/tfjs-backend-wasm'])
    //   ]
    // }
  }
})

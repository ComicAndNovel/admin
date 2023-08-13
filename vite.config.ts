import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(), 
    Components({
      resolvers: [VantResolver()],
    })
  ],
  // server: {
  //   cors:true,
  //   proxy: {
  //     // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
  //     '/api': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     }
  //   }
  // },
  
  build: {}
})

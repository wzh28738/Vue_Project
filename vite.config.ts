// loadEnv函数用于加载环境变量
import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入SVG插件
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from 'path'
//mock插件
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode}) =>{
  // 获取各个环境下的变量:process.cwd()为获取当前工作目录，即项目根目录,mode为当前环境
  let env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(),'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        enable: command === 'serve',
      })
    ],
    //scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@import "./src/styles/variables.scss";`
        },
      },
    },
    // 代理跨域配置
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 获取数据的服务器地址,即代理地址,这里用的是尚硅谷的接口地址
          target: env.VITE_SERVE,
          // 开启跨域
          changeOrigin: true,
          // 重写路径:将/api替换为空字符串，即/api/users/login变为/users/login，这样就可以直接访问/users/login
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})

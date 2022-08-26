import { defineConfig } from 'vite'
import {resolve} from 'path'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, "src"),
    },
    extensions: [".ts", ".vue", ".js", ".jsx", ".tsx"], // 导入时想要省略的扩展名列表。
  },
  server: {
    host: '0.0.0.0', // 会映射多个域名地址
    port: 8000, // 默认起始端口号
    open: true // 自动打开浏览器访问
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
        // 给导入的路径最后加上 ;
        additionalData: '@import "./src/styles/variables.scss";',
      },
    },
    postcss: {
      plugins: [
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  }
})

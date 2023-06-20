import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import { AppProvider } from '~/components/AppProvider/index'

// import '@unocss/reset/tailwind.css' // conflict with naive-ui
// import './styles/main.css'
import 'uno.css'

async function appInit() {
  const goAppProvider = createApp(AppProvider)

  const app = createApp(App)

  // 解决路由守卫，Axios中可使用，Dialog，Message 等全局组件
  goAppProvider.mount('#appProvider', true)
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
  app.use(router)

  // 挂载到页面
  app.mount('#app', true)
}

appInit()


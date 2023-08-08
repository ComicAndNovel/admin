import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import routes from './router'
import './assets/css/normalize.scss'
//@ts-ignore
import App from './App.tsx'


const router = createRouter({
  history: createWebHistory(),
  routes: routes
})




createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app')

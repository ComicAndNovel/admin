import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
// import LoQuery from './components/query/query.vue'
// import LoQueryItem from  './components/query/queryItem.vue'
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
  // .component('lo-query', LoQuery)
  // .component('lo-query-item', LoQueryItem)
  .mount('#app')

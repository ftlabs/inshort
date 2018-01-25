import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import ArticleSummary from './views/ArticleSummary'
Vue.use(VueRouter)

const router = new VueRouter({
  linkExactActiveClass: "o-header-services__nav-link--selected",
  mode: 'history',
  routes: [
      {
        path: '/',
        component: ArticleSummary
      }
  ]
})


new Vue({
  el: '#app', 
  router,
  render: h => h(App),
})

import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import VueRouter from 'vue-router'
import ArticleSummary from './views/ArticleSummary'
//import TimelineView from './views/TimelineView'

Vue.use(VueRouter)
const router = new VueRouter({
  linkExactActiveClass: "o-header-services__nav-link--selected",
  mode: 'history',
  routes: [
      {
        path: '/',
        component: ArticleSummary
      },
  ]
})


new Vue({
  el: '#app', 
  router,
  render: h => h(App),
  store
})

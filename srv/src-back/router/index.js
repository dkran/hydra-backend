import Vue from 'vue'
import Router from 'vue-router'
import ipinfo from '@/components/ipinfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ipinfo',
      component: ipinfo
    }
  ]
})

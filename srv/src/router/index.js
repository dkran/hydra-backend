import Vue from 'vue'
import Router from 'vue-router'
import InputForm from '@/components/InputForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'InputForm',
      component: InputForm
    }
  ]
})

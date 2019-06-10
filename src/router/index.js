import Vue from 'vue'
import Router from 'vue-router'

// Componentes del login
import User from '@/components/User'
import Login from '@/components/login/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'user',
      component: User,
      children: [
        {
          path: '/login',
          name: 'login',
          component: Login,
          meta: {
            title: 'Login - Kaptar'
          }
        }
      ]
    }
  ]
})

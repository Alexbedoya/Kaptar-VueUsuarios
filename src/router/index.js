import Vue from 'vue'
import Router from 'vue-router'

// Componentes del login
import User from '@/components/User'
import Login from '@/components/login/login'
import Register from '@/components/login/Register'

// Componentes del panel
import Panel from '@/components/Panel'
import Inicio from '@/components/panel/Inicio'
import Cupones from '@/components/panel/Cupones'
import ProcesarPago from '@/components/panel/ProcesarPago'
import Aporte from '@/components/panel/Aporte'
import Envases from '@/components/panel/Envases'
import Perfil from '@/components/panel/Perfil'

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
        },
        {
          path: '/registro',
          name: 'registro',
          component: Register,
          meta: {
            title: 'Registro - Kaptar'
          }
        }
      ]
    },
    {
      path: '/panel',
      name: 'panel',
      component: Panel,
      children: [
        {
          path: '/inicio',
          name: 'inicio',
          component: Inicio,
          meta: {
            title : 'Inicio - Kaptar'
          }
        },
        {
          path: '/cuponera',
          name: 'cupones',
          component: Cupones,
          meta: {
            title : 'Cuponera'
          }
        },
        {
          path: '/procesar-pago',
          name: 'procesar-pago',
          component: ProcesarPago,
          meta: {
            title : 'Procesar Pago'
          }
        },
        {
          path: '/aporte',
          name: 'mi-aporte',
          component: Aporte,
          meta: {
            title : 'Mi aporte'
          }
        },
        {
          path: '/perfil',
          name: 'perfil',
          component: Perfil,
          meta: {
            title : 'Mi perfil'
          }
        }
        ,
        {
          path: '/envases',
          name: 'envases',
          component: Envases,
          meta: {
            title : 'Revisa tus envases'
          }
        }
      ]

    }
  ]
})

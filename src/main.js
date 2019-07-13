import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'
import Element from 'element-ui'
import BootstrapVue from 'bootstrap-vue'
import VModal from 'vue-js-modal'
import VueQrcode from '@xkeshi/vue-qrcode'
import VueSessionStorage from 'vue-sessionstorage'
import moment from 'moment-timezone'
import VueResource from 'vue-resource';
import VueNumeric from 'vue-numeric'
import 'element-ui/lib/theme-chalk/display.css'

Vue.use(VModal)
Vue.use(Element)
Vue.use(BootstrapVue)
Vue.use(VueSessionStorage)
Vue.use(VueResource);
Vue.use(VueNumeric)
Vue.component('qrcode', VueQrcode)
Vue.config.productionTip = false

// formato de Fecha
Vue.prototype.$property = new Vue({
  methods: {
    moment (date, formato) {
      // var ftoHora = hora ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
      return moment(date).format(formato)
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

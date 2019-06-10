import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import ConfigUrl from '../components/lib/api-url.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    endPoint: ConfigUrl.endPoint.prod,
    metodoApi: ConfigUrl,
    cupons: null
  },
  mutations: {
    setCupons (state, payload) {
      state.cupons = payload
    }
  },
  actions: {
    actionCupones () {
      axios.get(this.state.endPoint + this.state.metodoApi.cupon)
      .then(resp => {
        let cuponVigente = '{ "data": ['
        let fechaActual = new Date().valueOf()
        for (let i = 0; i < resp.data.length; i++) {
          let vigenciaCupon = new Date(resp.data[i].finVigencia).valueOf()
          if (fechaActual <= vigenciaCupon){
            if (cuponVigente === '{ "data": ['){
              cuponVigente += JSON.stringify(resp.data[i])
            } else {
              cuponVigente += ',' + JSON.stringify(resp.data[i])
            }
          }
        }
        cuponVigente += ']}'
        let cupon = JSON.parse(cuponVigente)
        store.commit('setCupons', cupon.data)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    Cupones () {
      return this.store.cupons
    }
  }
})

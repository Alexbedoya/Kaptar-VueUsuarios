import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import configUrl from '../lib/url-api.json'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    metodoApi: configUrl,
    endPoint: configUrl.endPoint.local,
    cupones: null,
    categoria: null,
    filtroCategoria: null,
    pionerosIndicadoresData: null,
    valorDominio: new Map(),
    getTxUsuario: null,
    mensaje: '',
    botellaData: null,
    setPionerosData: null,
    error: null,
    destacados: null,
    nombreCategoria: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setCupoKaptar (state, payload) {
      state.cupones = payload
    },
    setCategoria (state, payload) {
      state.categoria = payload
    },
    setPionerosData (state, payload) {
      state.setPionerosData = payload
    },
    setValorDominio (state, payload) {
      state.valorDominio = payload
    },
    setGetTxUsuario (state, payload) {
      state.getTxUsuario = payload
    },
    setBotellaData (state, payload) {
      state.botellaData = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setMensajeModal (state, payload) {
      state.mensaje = payload
    },
    setDestacados (state, payload) {
      state.destacados = payload
    }
  },
  actions: {
    // Aciones referentes al registro y datos del usuario logeado
    actionAutoLoginUser ({ data }) {
      var fechaDay = new Date(sessionStorage.getItem('validDate'))
      var fechaActual = new Date()
      var diasdif= fechaActual.getTime()-fechaDay.getTime();
      var contdias = Math.round(diasdif/(1000*60*60*24));      
      if (contdias >= 1) {
        store.dispatch('actionCloseSesion')
      } else {
        let user = sessionStorage.getItem('data')
        store.commit('setUser', JSON.parse(user))
        store.dispatch('actionGetPionero', JSON.parse(user))
        router.push('/inicio')
      }
    },
    actionLoginUser ({ data }, payload) {
      let url = this.state.metodoApi
      axios.post(this.state.endPoint + url.loginUser, payload)
      .then(resp => {
        store.commit('setUser', resp.data)
        store.dispatch('actionGetPionero', resp.data)
        sessionStorage.setItem('data', JSON.stringify(resp.data))
        sessionStorage.setItem('validDate', new Date().toJSON())
        // sessionStorage.setItem('login', JSON.stringify(payload))
      }).catch(error => {
        alert('error', error)
      })
    },
    actionCupon () {
      let url = this.state.metodoApi
      axios.post(this.state.endPoint + url.cupon)
      .then(resp => {
        store.commit('setCupoKaptar', resp.data.data)
      }).catch(error => {
        console.log('error', error)
      })
    },
    actionGetPionero ({ data }, payload) {
      let url = this.state.metodoApi
      // let currentUrl = window.location.href.split('#')
      axios.get(this.state.endPoint + url.consultarUsuario.replace('{id}', payload.id))
      .then(resp => {
        store.commit('setPionerosData', resp.data)
        store.dispatch('actionGetTxUsuario', { id: payload.id })
        let user = this.state.user
        if (user.nombre === null || user.apellido === null) { 
          router.push('/perfil')
        } else {
          router.push('/inicio')
        }  
      }).catch(err => {
        console.log("no se pudo traer la información de puntos", err)
      })
    },
    actionActualizarInfoUsuario ({ data }, payload) {
      let url = this.state.metodoApi
      axios.get(this.state.endPoint + url.consultarUsuario.replace('{id}', payload.id))
      .then(resp => {
        store.commit('setPionerosData', resp.data)  
        store.dispatch('actionGetTxUsuario', { id: payload.id })
      }).catch(err => {
        console.log("no se pudo traer la información de puntos", err)
      })
    },
    actionCategoria (payload) {
      store.commit('setCategoria', payload)
    },
    // Acciones referentes a los Dominios
    actionGetDominio ({ data }, payload) {
      let url = this.state.metodoApi
      axios.get(this.state.endPoint + url.dominios, {
        params: {
          filter: { 'include': { 'relation': 'valores' } }
        }
      })
      .then(response => {
        var dominios = new Map()
        console.log('dominios', response)
        response.data.forEach(element => {
          if (!dominios.has(element.id)) {
            dominios.set(element.id, element.valores)
          }
        })
        store.commit('setValorDominio', dominios)
      })
    },
    actionLoginUserMercadoPago ({ data }, payload) {
      console.log('actionLoginUserMercadoPago')
      let url = this.state.metodoApi
      axios.post(this.state.endPoint + url.loginUser, payload)
      .then(response => {
        store.commit('setUser', response.data)
        store.dispatch('actionGetPioneroMercadoPago', response.data)
        localStorage.setItem('data', JSON.stringify(response.data))
        localStorage.setItem('validDate', new Date().getDate())
        localStorage.setItem('menuUsuario', JSON.stringify(response.data))
        sessionStorage.setItem('login', JSON.stringify(payload))
      }).catch(error => {
        alert('error', error)
      })
    },
    actionGetPioneroMercadoPago () {
      console.log('actionGetPioneroMercadoPago')
      let url = this.state.metodoApi
      axios.get(this.state.endPoint + url.consultarUsuario.replace('{id}', payload.id))
      .then(resp => {
        store.commit('setPionerosData', resp.data)
      }).catch(err => {
        console.log("no se pudo traer la información de puntos")
      })
    },
    actionGetTxUsuario ({ data }, payload) {
      let url = this.state.metodoApi
      axios.get(this.state.endPoint + url.consultarBalance.replace('{id}', payload.id), {
        params: {
          filter: { 'limit': 100, order: 'fechaTx DESC' }
        }
      })
      .then(resp => {
        console.log('actionGetTxUsuario', resp)
        if (resp.data.length !== 0) {
          store.commit('setGetTxUsuario', resp.data)
        } else {
          store.commit('setGetTxUsuario', '')
        }
      }).catch(err => {
        console.log("error al consultar los balances", err)
      })
    },
    actionGetBotella ({ data }, payload) {
      let url = this.state.metodoApi
      let filter = { 'where': { 'codigo': payload.code } }
      axios.get(this.state.endPoint + url.productos, {params: {filter}})
      .then(resp => {
        if (resp.data.length !== 0) {
          store.commit('setBotellaData', resp.data)
          store.commit('setError', '')
        } else {
          store.commit('setBotellaData', '')
          store.commit('setError', { 'tipo': 'error', 'mensaje': 'El producto no existe' })
        }
      }).catch(err => {
        console.log('Error consultando los productos', err)
      })
    },
    actionActualizarUsuario({ data }, payload) {
      let url = this.state.metodoApi
      console.log('actualizar usuario', payload)
      axios.post(this.state.endPoint + url.usuariosAdministrar, payload)
      .then(resp => {
        console.log('resp', resp)
        store.commit('setUser', resp.data.datos)
        store.commit('setMensajeModal', 'Usuarios actualizado')
      }).catch(err => {
        console.log('No se pudo actualizar el usuario', err)
      })
    },
    actionCreateUser ({ data }, payload) {
      let url = this.state.metodoApi
      axios.post(this.state.endPoint + url.usuariosAdministrar, payload)
      .then(resp => {
        console.log('resp', resp)
        switch (resp.data.respuesta) {
          case 'ok':
            let newUser = {username: payload.email, password: payload.password}
            store.dispatch('actionLoginUser', newUser)
            break
          case 'error':
            alert(resp.data.mensaje)
            break
        }
      }).catch(err => {
        console.log('No se pudo crear el usuario', err)
      })
    },
    actionActualizarFoto ({ data }, payload) {
      console.log('data', payload.fd, 'id', payload.user.id)
      let url = this.state.metodoApi
      axios.post(this.state.endPoint + url.actualizarFoto.replace('{id}', payload.user.id), payload.fd)
      .then(resp => {
        console.log('foto', resp)
        payload.user.urlAvatar = resp.data.data.urlAvatar
        store.dispatch('actionActualizarUsuario', payload.user)
      }).catch(err => {
        console.log('error', err)
      })
    },
    actionCloseSesion ({ data }) {
      store.commit('setUser', null)
      sessionStorage.removeItem('data')
      sessionStorage.removeItem('validDate')
      router.push('/login')
    },
    actionGetCuponesDestacados ({ data }) {
      let dateCurrent = new Date()
      let url = this.state.metodoApi
      let filter = {'where': { 'and': [{ 'inicioVigencia': { 'lte': dateCurrent } }, { 'finVigencia': { 'gte': dateCurrent } }, { 'isDestacado': true }] }}
      axios.get(this.state.endPoint + url.cupones, { params: {filter}})
      .then(resp => {
        store.commit('setDestacados', resp.data)
      }).catch(err => {
        console.log('error anuncios', err)
      })
    }
  }
})

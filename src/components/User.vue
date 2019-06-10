<template>
  <div id="login">
    <div class="header-login">

      <div class="login-container">
        <img class="logo" :src="logo" alt="">
        <router-view></router-view>
      </div>
    </div>
    <!--<div class="wrp">

    </div>--> 

  </div>
</template>

<script>
import router from '../router'
import { Glide, GlideSlide } from 'vue-glide-js'
  export default {
    components: {
      [Glide.name]: Glide,
      [GlideSlide.name]: GlideSlide
    },
    data () {
      return {
        // cupon: this.$store.state.cupons,
        logo: './static/images/logo.svg'
      }
    },
    created () {
      this.$store.dispatch('actionCupones')
      router.push('/login')
    }
  }
</script>


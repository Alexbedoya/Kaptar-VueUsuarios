<template>
  <div id="login">
    <div class="header-login">
      <div class="login-container">
        <img class="logo" :src="logo" alt="">
        <router-view></router-view>
      </div>
    </div>
    
    <div class="wrp">

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        logo: './static/images/logo.svg'
      }
    },
    created () {
      this.$router.push('/login')
    }
  }
</script>


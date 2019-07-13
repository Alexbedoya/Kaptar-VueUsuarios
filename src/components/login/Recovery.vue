<template>
  <v-app id="">
    <h2 class="login-title">Recuperar Contraseña</h2>
    <div class="form-c">
      <v-form class="form-login" @submit.prevent="onSingUp">
        <el-input label="Email" type="email" v-model="email" required></el-input>
        <button type="submit" class="btn-login">Continuar</button>
        <p class="terms-text"></p>
      </v-form>
    </div>
    <div class="btn-accion">¿Ya tienes una cuenta?
      <router-link to="login">
        <button class="btn-accion--btn">Logeate</button>
      </router-link>
    </div>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        celular: '',
        email: '',
        password: ''
      }
    },
    computed: {
      usuario () {
        return this.$store.state.user
      }
    },
    methods: {
      onSingUp () {
        this.$store.dispatch('actionCreateUser', {email: this.email, password: this.password})
      }
    }
  }
</script>

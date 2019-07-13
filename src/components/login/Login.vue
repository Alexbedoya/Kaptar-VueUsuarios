<template>
    <section>
        <h2 class="login-title">¡Hola! para seguir ingresa tus datos</h2>
        <div class="form-c">
            <el-form class="form-login" ref="form">
            <el-form-item>
                <el-input placeholder="Email o usuario" v-model="email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="Clave" v-model="password" type="password"></el-input>
            </el-form-item>
            <el-button native-type="submit" type="primary" class="button100" @click="loginUser">Continuar</el-button>
            
            <router-link class="l-registro" to="recuperar">Olvide mi contraseña</router-link>
            </el-form>
            <div v-if="error" class="error-login"> {{error.mensaje}}</div>

        </div>
        <div class="form-c">
        <div class="btn-accion">¿No tienes una cuenta?
            <router-link to="registro">
            <el-button class="button100" round>Registrate</el-button>
            </router-link>
        </div>
        </div>
    </section>
</template>

<script>
import { Loading } from 'element-ui';
export default {
    data () {
      return {
        email: '',
        password: '',
      }
    },
    created: function () {
      this.$store.dispatch('actionAutoLoginUser')
    },
    computed: {
      usuario () {
        return this.$store.state.user
      },
      error () {
        return this.$store.state.error
      }
    },
    methods: {
      loginUser () {
        this.$store.dispatch('actionLoginUser', {username: this.email, password: this.password})
      }
    }
}
</script>


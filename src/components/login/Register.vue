<template>
  <section>
    <h2 class="login-title">Registrate en Kaptar</h2>
    <div class="form-c">
      <el-form :model="form_registro" class="form-login" ref="form">
        <el-form-item>
          <el-input placeholder="Email o usuario" type="email" v-model="form_registro.email" required></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="Celular" v-model="form_registro.celular" required></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="Cédula de ciudadania" v-model="form_registro.cedula" required></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="Contraseña" type="password" v-model="form_registro.password" 
          auto-complete="off" required></el-input>
        </el-form-item>
        <el-button native-type="submit" type="primary" class="button100" @click="onSingUp">Continuar</el-button>
        
        <p class="terms-text">Al Continuar, aceptas las condiciones de uso y la Política de privacidad de Kaptar</p>
      </el-form>
    </div>

    <div class="form-c">
      <div class="btn-accion">¿Ya tienes una cuenta?
        <router-link to="login">
          <el-button class="button100" round>Logeate</el-button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        activarBoton: true,
        form_registro: {
          celular: '',
          cedula: '',
          email: '',
          password: ''
        },
        iden: {
          cedula: { 'tipo': '5', 'valor': '', 'id': '' },
          celular: { 'tipo': '4', 'valor': '', 'id': '' },
          civicaEx: { 'tipo': '6', 'valor': '', 'id': '' },
          civicaIn: { 'tipo': '2', 'valor': '', 'id': '' },
          correo: { 'tipo': '3', 'valor': '', 'id': '' }
        },
        props: {
          email: '',
          password: '',
          username: '',
          identificaciones: []
        }
      }
    },
    methods: {
      onSingUp () {
        this.props.email = this.form_registro.email
        this.props.username = this.form_registro.email
        this.props.password = this.form_registro.password
        this.iden.correo.valor = this.form_registro.email
        this.iden.cedula.valor = this.form_registro.cedula
        this.iden.celular.valor = this.form_registro.celular

        for (var i in this.iden) {
          if (this.iden[i].valor) {
            if (this.iden[i].id === '') {
            delete this.iden[i].id
            }
            this.props.identificaciones.push(this.iden[i])
          }
        }
        this.$store.dispatch('actionCreateUser', this.props)
      }
    }
  }
</script>

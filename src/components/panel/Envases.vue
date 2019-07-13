<template>
  <section id="main-section">
    <div class="title-page">
      <div class="title-page__text">Envases</div>
    </div>
    <!-- <div class="preloader" v-if="preloader === true">
      <img :src="preloaderImg" alt="">
    </div> -->
    <div class="body-page">

      Infórmate sobre los productos recibidos por el sistema Kaptar en los diferentes Kioskos y maquinas Kaptadoras.

      <h5>Busca tu envase</h5>
      <p>Ingresa el número del codigo de barras de tu envase.</p>
      <el-form :inline="true" :model="formCodigo" class="demo-form-inline">
        <el-form-item label="Codigo de barras">
          <el-input v-model="formCodigo.code" placeholder="Ejm: 7700289090"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary" @click="buscarBotella">Buscar</el-button>
        </el-form-item>
      </el-form>

      <h5>Lo que recibimos</h5>
      <el-row class="row_bottles" :gutter="24">
        <el-col :span="6" :xs="24">
          <el-card shadow="hover" class="box-card">
            <div class="card_bottle">
              <img class="icono-bottella" src="../../../static/images/bottle.svg" alt="">
              <span class="title">Botellas</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" :xs="24">
          <el-card shadow="hover" class="box-card">
            <div class="card_bottle">
              <img class="icono-bottella" src="../../../static/images/bottle.svg" alt="">
              <span class="title">Latas</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" :xs="24">
          <el-card shadow="hover" class="box-card">
            <div class="card_bottle">
              <img class="icono-bottella" src="../../../static/images/bottle.svg" alt="">
              <span class="title">Limpieza</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" :xs="24">
          <el-card shadow="hover" class="box-card">
            <div class="card_bottle">
              <img class="icono-bottella" src="../../../static/images/bottle.svg" alt="">
              <span class="title">Tetra Pak</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" :xs="24">
          <el-card shadow="hover" class="box-card">
            <div class="card_bottle">
              <img class="icono-bottella" src="../../../static/images/bottle.svg" alt="">
              <span class="title">Pilas</span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <h5>No recibimos</h5>
    </div>
    <!-- Fin de body page -->

    <!-- modal de los detalles de la botella traida -->
    <el-dialog
      :title="bottleData.nombre"
      :visible.sync="dialogoBotellas"
      width="30%"
      center>
      <span>Capacidad: {{bottleData.capacidad}} ml</span>
      <img :src="'https://www.kaptarnosmueve.com/img_productos/' + bottleData.codigo + '.jpg'" width="80px" alt="">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogoBotellas = false">Aceptar</el-button>
      </span>
    </el-dialog>

    <!-- modal de no existe botella -->
    <el-dialog
      title="No existe"
      :visible.sync="dialogoBotellasNoExiste"
      width="30%"
      center>
      <span>no existe :()</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogoBotellasNoExiste = false">Aceptar</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<style>
#main-section{
	width: 80%;
	margin: 0 auto;
}
.el-dialog--center .el-dialog__body {
  text-align: center;
}
</style>

<script>
  export default {
    data () {
      return {
        formCodigo: {
          code: ''
        },
        dialogoBotellas: false,
        dialogoBotellasNoExiste: false,
        bottleData: '',
        prueba: './static/images/bottle.svg'
      }
    },
    computed: {
      envases () {
        return this.$store.state.botellaData
      },
      alertaMensaje () {
        return this.$store.state.error
      }
    },
    methods: {
      buscarBotella () {
        this.$store.dispatch('actionGetBotella', {code: this.formCodigo.code})
      }
    },
    watch: {
      envases: function (val) {
        if (val !== '') {
          this.bottleData = val[0]
          this.dialogoBotellas = true
        } else {
          this.dialogoBotellasNoExiste = true
        }
      }
    }
  }
</script>
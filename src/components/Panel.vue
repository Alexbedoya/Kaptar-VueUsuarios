<template>
  <section>
    <header id="main-header">
      <el-row style=" color: #00b4e6; font-weight: 700;">
        <el-col :xs="12" :sm="13" :md="6">
          <img src="./../static/images/Logo Kaptar.svg" class="logo" @click="goInicio" style="cursor:pointer">
        </el-col>
        <el-col :xs="0" :sm="5" :md="13">
          <div class="texto-header">Hola {{ usuario.nombre }} tienes:</div>
        </el-col>
        <el-col :xs="7" :sm="3" :md="3">
          <!--<div class="texto-header">{{ usuarioDetalle.puntos_kaptar }} PK</div> -->
          <div class="texto-header pointer" @click="menu('/aporte')" >
            <vue-numeric read-only separator="," v-model="usuarioDetalle.puntos_kaptar"></vue-numeric> PK
          </div>
        </el-col>
        <el-col :xs="1" :sm="2" :md="2" v-b-toggle.collapse-2 style="text-align: center;">
          <div id="imagen-perfil">
            <div class="imgCont pointer">
              <img v-if="usuario.urlAvatar == null || usuario.urlAvatar == ''" class="" src="../../static/images/user.svg" alt="">
              <img v-else class="" :src="usuario.urlAvatar">
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div>
          <b-collapse id="collapse-2" class="pointer">
            <div class="texto-menu-perfil" @click="menu('/perfil')" v-b-toggle.collapse-2>Mi perfil</div>
            <div class="texto-menu-perfil" @click="salir" v-b-toggle.collapse-2 >Salir</div>
          </b-collapse>
        </div>
      </el-row>
    </header>

    <el-main style="margin-top: 60px;">
      <el-container>
        <div id="menu" @click="menuActivo">
          <div class="pointer">
            <img @click="clicMenu" src="../assets/menu/inicio.png" class="icono-menu" > 
            <span :id="menuMobile" @click="menu('/inicio')">Home</span> 
          </div>
          <div class="pointer">
            <img @click="clicMenu" src="../assets/menu/progresion-grafica.png" class="icono-menu">
            <span :id="menuMobile" @click="menu('/aporte')" >Balance</span> 
          </div>
          <div class="pointer">
            <img @click="clicMenu" src="../assets/menu/coque.png" class="icono-menu">
            <span :id="menuMobile" @click="menu('/envases')">Revisa tus Envases</span>
          </div>
          <div class="pointer">
            <img @click="clicMenu" src="../assets/menu/pin.png" class="icono-menu">
            <span :id="menuMobile" @click="ubicacion">Kioskos Kaptar</span>
          </div>
        </div>
          <el-main>
              <router-view></router-view>
          </el-main>
        </el-container>
    </el-main>
    <el-container v-if="MostrarContacto" v-show="false">
      <el-row :gutter="20" id="zona-contacto">
        <el-col :xs="24" :sm="7" :md="8">
          <div><img src="../../static/icons/icono_correo.png" class="icono"></div>
          <span>Email</span>
          <p>info@kaptarnosmueve.com</p>
        </el-col>
        <el-col :xs="24" :sm="7" :md="8">
          <div><img src="../../static/icons/icono_telefono.png" class="icono"></div>
          <span>Teléfono</span>
          <p>+57(4) 516 77 70 Ext: 1059</p>
        </el-col>
        <el-col :xs="24" :sm="7" :md="8" >
          <div><img src="../../static/icons/icono_ubicacion.png" class="icono"></div>
          <span>Sede</span>
          <p>Calle 67 # 52-20 Torre A - Oficina 4016</p>
          <p>Complejo Ruta N</p>
        </el-col>
      </el-row>
    </el-container>
    <el-container style="background: #1685de;">
      <div id="footer-redes"> 
        <el-row :gutter="20" id="zona-contacto">
          <el-col :md="8">
            <p>KAPTAR un proyecto desarrollado por EFFITECO S.A.S</p>
          </el-col>
          <el-col :md="8">
            <p>Conoce màs</p>
          </el-col>
          <el-col :md="8">
            <span @click="redSocial('https://www.facebook.com/Kaptarnosmueve/')"><img class="icon-red-social" src="../assets/facebook.png"></span>
            <span @click="redSocial('https://www.instagram.com/kaptarnosmueve/?hl=es-la')"><img class="icon-red-social" src="../assets/instagram.png"></span>
            <span @click="redSocial('https://twitter.com/kaptarnosmueve')"><img class="icon-red-social" src="../assets/twitter.png"></span>
            <span @click="redSocial('https://www.youtube.com/channel/UCZPqgGXUPfMvdXhkqq_1PMg')"><img class="icon-red-social" src="../assets/youtube.png"></span>
          </el-col>
        </el-row>
      </div>
    </el-container>
    <el-container id="footer-zone">
      <el-row style="width:80%; margin:0 auto">
        <el-col>
          <span class="white--text"> © {{ anoActual }} kaptar - Todos los derechos reservados</span>
        </el-col>
      </el-row>
    </el-container>
  </section>
</template>

<style>
#imagen-perfil {
  position: absolute;
  right: 20px;
}
@media (max-width: 600px) {
  .texto-menu-perfil{
    font-size: 10px;
  }
}
body {
  height: 0px !important;
  color: gray !important;
}
.line-style {
  background: #1685de;
}
.pointer {
  cursor: pointer;
}
#collapse-2 {
  position: absolute;
  right: 0;
  background: white;
  width: 90px;
  padding: 15px;
  border-bottom-left-radius: 10px;
  color: #45b5ec;
  border-left: #00b4e6 4px solid;
  border-bottom: #00b4e6 1px solid;
  font-size: 14px;
}
#perfil-usuario {
  position: absolute;
  right: 0%;
  top: 100%;
  z-index: 1000;
  background: #1685de;
  width: 90px;
  padding: 2%;
  border-bottom-left-radius: 11px;
  border-bottom-right-radius: 11px;
}
header#main-header {
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 1000;
  padding-top: 10px;
  background: white;
  /* box-shadow: 1px -5px 15px #00b4e6;
  border-bottom: #00b4e6 1px solid; */
}
.texto-header{
  padding-top: 15px;
  text-align: right;
  padding-right: 15px;
}
/*.boton-menu:hover {
  width: 200px;
  font-size: 14px;
}*/
#boton-menu-slide {
  margin: 15px;
  font-size: 14px;
  transition:width .5s, font-size .5s;
  color: white;
}
#boton-menu{
  transition: width .5s, font-size .5s;
  font-size: 0px;
  width: 44px;
  cursor: pointer;
  color: white;
}
.boton-menu > span{
  color: white;
  display: inline-block;
  position: absolute;
  margin-left: 8px;
  padding-top: 8px;
}
.icono-menu{
  width: 20px;
  height: 20px;
  margin: 10px;
}
#menu {
  background: #1685de;
  position: fixed;
  padding: 10px 5px 10px 5px;
  top: 30%;
  left: 0px;
  z-index: 9999;
  border-radius: 0px 30px 30px 0px;
}
#footer-redes{
  width:80%;
  margin: 0 auto;
  color: white;
}
.icono{
  width: 15px;
  height: 15px;
}
#zona-contacto{
  width: 100%;
  padding: 0px !important;
  text-align: center;
}
.margin20 {
  margin: 2%;
}
.padding4 {
  padding-left: 4%;
}
.white--text{
  color: white;
}
#titulo{
  font-size: 44px;
  font-weight: bold;
  color: #00b4e6;
  margin-left: 20px;
}
#footer-zone { 
  background: #2296f3;
}
/* Menu */
.bm-burger-button {
  cursor: pointer;
  height: 30px;
  left: 6px;
  position: absolute;
  top: 86px;
  width: 36px;
}
.bm-menu {
  background-color: #1685de;
  height: auto;
  top: 22%;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}
.bm-item-list > a {
  cursor: pointer;
}
img.icon-red-social {
  width: 30px;
  margin: 13px;
  cursor: pointer;
}
.bm-overlay{
  background: white !important;
}
.bm-item-list>*>span{
  font-weight: normal !important;
}
.bm-item-list {
  font-size: 15px !important;
  margin-left: 0px !important;
}
.logo {
  margin-left: 15px;
  margin-top: 5px;
}
</style>


<script>
import { Slide } from 'vue-burger-menu'
import { watch } from 'fs'
import VueNumeric from 'vue-numeric'

export default {
  components: {
    Slide,
    VueNumeric
  },
  data () {
    return {
      noUser: '../../static/images/user.svg',
      mostrarMenu:false,
      MostrarContacto: false,
      puntosUsr: 0,
      logo: './static/images/logo.svg',
      anoActual: null,
      setPionerosData: '',
      menuMobile: 'boton-menu',
      isMenuActivo: false 
    }
  },
  props: {
    source: String
  },
  created: function () {
    this.$store.dispatch('actionAutoLoginUser')
  },
  computed: {
    usuario () {
      this.anoActual = new Date().getFullYear()
      if (this.$store.state.user) {
        return this.$store.state.user
      }
      return {}
    },
    usuarioDetalle () {
      if (this.$store.state.setPionerosData) {
        return this.$store.state.setPionerosData
      }
      return {}
    }
  },
  methods: {
    goInicio () {
      this.$router.push('/inicio')
    },
    menu (item) {
      this.$router.push(item)
      this.menuMobile = 'boton-menu'
    },
    ubicacion () {
      window.open('https://www.kaptarnosmueve.com/horarios-kioskos-kaptar/', '_blank')
    },
    salir () {
      this.$store.dispatch('actionCloseSesion')
    },
    redSocial (url) {
      window.open(url, '_blank')
      this.menuMobile = 'boton-menu'
    },
    clicMenu () {
      this.menuMobile = 'boton-menu-slide'
    },
    menuActivo() {
      if (this.isMenuActivo === true){
        this.isMenuActivo = false
        this.menuMobile = 'boton-menu'
      } else {
        this.isMenuActivo = true
      }
    }
  },
  watch: {
    usuario: function (val) {
      return this.$store.state.user
    },
    usuarioDetalle: function (val) {
      return this.$store.state.setPionerosData
    }
  }
}
</script>

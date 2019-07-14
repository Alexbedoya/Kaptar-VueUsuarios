<template>
	<section id="main-section">
		<div class="title-page">
      <div class="title-page__text">Mi perfil</div>
    </div>
		<div>
			<el-row>
				<el-col style="text-align: center;">
					<div class="imgContPerfil">
            <img v-if="getUser.urlAvatar == null || getUser.urlAvatar == ''" class="" src="../../../static/images/user.svg" alt="">
            <img v-else class="" :src="getUser.urlAvatar">
          </div>
				</el-col>
				<!--<input type="file" @change="onFileSelected" > -->
				<input type="file" name="image" @change="getImage" accept="image/*">
        <!--<button @click="updateAvatar">Subir Imagen</button> -->
			</el-row>
			<el-form label-position="top" ref="form_perfil" :model="form_perfil" >
				<el-row>
					<el-col :xs="24" :sm="10" :md="10" style="margin-rigth:20px">
						<!--Nombre <el-input v-model="getUser.nombre" ></el-input>-->
						<el-form-item label="Nombres">
							<el-input v-model="form_perfil.nombre"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="10" :md="10" style="margin-rigth:20px">
						<el-form-item label="Apellidos">
							<el-input v-model="form_perfil.apellido"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :xs="24" :sm="10" :md="10" style="margin-rigth:20px">
						<el-form-item label="Genero">
							<el-select v-model="form_perfil.genero">
								<el-option label="Hombre" value="Hombre"></el-option>
								<el-option label="Mujer" value="Mujer"></el-option>
								<el-option label="Personalizado" value="Presonalizado"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="10" :md="10" style="margin-rigth:20px">
						<el-form-item label="Fecha de Nacimiento">
							<date-picker v-model="form_perfil.fechaNacimiento" lang="lang" format="YYYY-MM-DD"></date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :xs="24" :sm="10" :md="10" style="margin-rigth:20px">
						<el-form-item label="Número de Identificacion">
							<el-input v-model="form_perfil.cedula"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="10" :md="10" style="margin-rigth:20px">
						<el-form-item label="Celular">
							<el-input v-model="form_perfil.celular"></el-input>
						</el-form-item>
					</el-col>	
				</el-row>
				<el-row>
					<el-col :xs="24" :sm="10" :md="10" style="margin-rigth:20px">
						<el-form-item label="Direccion">
							<el-input v-model="form_perfil.direccion"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="10" :md="10" style="margin-rigth:20px">
						<el-form-item label="Email">
							<el-input v-model="form_perfil.email" :value="getUser.email" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-button type="primary" @click="outerVisible = true">Guardar Datos</el-button>
				</el-row>
			</el-form>
		</div>

		<el-dialog width="60%" title="" :visible.sync="outerVisible">
			<div>¿Estás seguro que deseas realizar los cambios?</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="outerVisible = false">Cancel</el-button>
				<el-button type="primary" @click="enviar">Aceptar</el-button>
			</div>
		</el-dialog>

		<el-dialog width="60%" title="" :visible.sync="modalMensaje">
			<div>{{getMensajeModal}}</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="modalMensaje = false">Aceptar</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<style>
@media (max-width: 360px) {
	.imgContPerfil {
		border-radius: 50%;
		overflow: hidden;
		display: inline-block;
		width: 160px !important;
		height: 160px !important;
		margin-bottom: 10px;
	}
	.imgContPerfil img {
		width: 160px !important;
	}
}
.el-form-item {
  margin-right: 20px;
}
.imgContPerfil {
	border-radius: 50%;
	overflow: hidden;
	display: inline-block;
	width: 260px;
	height: 260px;
	margin-bottom: 10px;
}
.imgContPerfil img {
  width: 260px;
}
#main-section {
	width: 80%;
	margin: 0 auto;
}
</style>

<script>
import DatePicker from 'vue2-datepicker'

export default {
	components: {
		DatePicker 
	},
  data () {
		return {
			form_perfil: {
				id: '',
				nombre: '',
				apellido: '',
				genero: 'Hombre',
				fechaNacimiento: '',
				celular: '',
				cedula: '',
				direccion: ''
			},
			noUser: '../../../static/images/user.svg',
			selectedFile: null,
			iden: {
				cedula: { 'tipo': '5', 'valor': '', 'id': '' },
				celular: { 'tipo': '4', 'valor': '', 'id': '' },
				civicaEx: { 'tipo': '6', 'valor': '', 'id': '' },
				civicaIn: { 'tipo': '2', 'valor': '', 'id': '' },
				correo: { 'tipo': '3', 'valor': '', 'id': '' }
			},
			props: {
				nombre: '',
				apellido: '',
				dob: '',
				email: '',
				genero: '',
				urlAvatar: '',
				username: '',
				direccion: '',
				estado: '',
				usuarioDigital: '',
				medioRegistro: '1',
				identificaciones: [],
				usuarioCrea: '',
				idLugarCrea: '',
				idLugarModifica: '',
				fechaCrea: '',
				fechaModifica: '',
				usuarioModifica: '',
				idUsuarioRef: '',
			},
			outerVisible: false,
			modalMensaje: false
		}
	},
	computed: {
		getUser () {
			return this.$store.state.user
		},
		getMensajeModal () {
			return this.$store.state.mensaje
		}	
	},
	mounted () {
		let user = this.$store.state.user
		this.form_perfil.nombre = user.nombre
		this.form_perfil.apellido = user.apellido
		this.form_perfil.direccion = user.direccion
		this.form_perfil.fechaNacimiento = user.dob
		this.form_perfil.email = user.email
		if (user.genero !== null) {
			this.form_perfil.genero = user.genero
		}
		for (let i = 0; i < user.identificaciones.length; i++) {
			switch (user.identificaciones[i].tipo) {
				case '5':
					this.form_perfil.cedula = user.identificaciones[i].valor
					break
				case '4':
					this.form_perfil.celular = user.identificaciones[i].valor
					break
			}
		}
	},
	methods: {
		getImage (event) {
			this.selectedFile = event.target.files[0]
		},
		enviar () {
			let user = this.$store.state.user
			this.props.nombre = this.form_perfil.nombre,
			this.props.apellido = this.form_perfil.apellido,
			this.props.dob = new Date(this.form_perfil.fechaNacimiento).toJSON(),
			this.props.genero = this.form_perfil.genero,
			this.props.urlAvatar = user.urlAvatar,
			this.props.direccion = this.form_perfil.direccion,
			this.props.usuarioDigital = user.usuarioDigital,
			this.props.fechaCrea = user.fechaCrea,
			this.props.medioRegistro = user.medioRegistro,
			this.props.realm = user.realm,
			this.props.username = this.form_perfil.email,
			this.props.email = this.form_perfil.email,
			this.props.idUsuarioRef = user.idUsuarioRef,
			this.props.usuarioCrea = user.usuarioCrea,
			this.props.usuarioModifica = user.id,
			this.props.fechaModifica = new Date().toJSON(),
			this.props.estado = user.estado,
			this.props.idLugarCrea = user.idLugarCrea,
			this.props.idLugarModifica = user.idLugarModifica,
			this.props.latitudCrea = user.latitudCrea,
			this.props.longitudCrea = user.longitudCrea,
			this.props.latitudModifica = user.latitudModifica,
			this.props.longitudModifica = user.longitudModifica,
			this.props.id = user.id				
			this.iden.correo.valor = this.props.email
			this.iden.celular.valor = this.form_perfil.celular
			this.iden.cedula.valor = this.form_perfil.cedula

			for (var i in this.iden) {
				if (this.iden[i].valor) {
					if (this.iden[i].id === '') {
					delete this.iden[i].id
					}
					this.props.identificaciones.push(this.iden[i])
				}
			}
			// actualizar imagen
			const fd = new FormData()
			fd.append('img', this.selectedFile)
			let item = {
				fd: fd,
				user: this.props
			}
			this.$store.dispatch('actionActualizarFoto', item)
			// fin actualizar imagen
			// this.$store.dispatch('actionActualizarUsuario', this.props)
			this.outerVisible = false
			this.modalMensaje = true
		}
	}
}
</script>

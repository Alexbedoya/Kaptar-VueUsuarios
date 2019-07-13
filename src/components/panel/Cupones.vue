<template>
	<section style="min-height: 450px;">
		<img :src="tituloCategoria.icono" width="60px" height="60px">
		<span id="titulo-Categoria">{{ tituloCategoria.nombre }}</span>
		<el-row>
			<el-col :xs="12" :sm="12" :md="10" v-for="item in cuponesFiltrados" :key="item.id" style="margin: 0 28px 10px 28px;"> <!--:offset="item.id > 0 ? 2 : 0"-->
				<el-card :body-style="{ padding: '0px' }" shadow="hover" class="card-cupon">
					<img :src="item.urlInterna" class="image imagen-cupon" @mouseover="visibleBotones">
					<span class="puntosKaptar">{{ item.puntosKaptar }} PK</span>
					<div class="bottom clearfix">
						<el-button :md="10" class="boton-detalle" @click="detalle(item)">Detalle</el-button>
						<el-button :md="10" class="boton-comprar" @click="confirmarCompra(item)">Comprar</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!--Modal Detalle-->
		<el-dialog v-if="infoDetalle !== null"
			title="Detalle"
			:visible.sync="centerDialogVisible"
			width="60%"
			center>
			<img class="img-cupon" :src="infoDetalle.urlPortada" width="100%">
			<h4>{{ infoDetalle.nombre }}</h4>

			<span class="destacado">{{infoDetalle.textoDestacado}}</span><br>
			<span>Vigencia</span>
			Cupón válido desde el<b>{{ infoDetalle.inicioVigencia }}</b> hasta el 
			<b>{{ infoDetalle.finVigencia }}</b>

			<span>Lugar</span>
        <p>{{ infoDetalle.lugar }}</p>

			<span>Horario</span>
        <p>{{infoDetalle.horario}}</p>

			<span>Valor</span>
        <p class="valorPk">{{infoDetalle.puntosKaptar}} PK</p><br>

			<span>Descripcion</span>
        <p>{{infoDetalle.descripcion}}</p>

			<span>Términos y Condiciones</span>
				<p v-html="infoDetalle.terminos"></p>

			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">Cancel</el-button>
				<el-button type="primary" @click="comprar(item)">Comprar</el-button>
			</span>
		</el-dialog>

		<!-- Modal respuesta de la compra -->
		<el-dialog v-if="infoDetalle !== null" v-model="respuestaCompra" width="60%"
			center :visible.sync="centerDialogCompraCupon">
			<div class="cuponRes">
				<h4 class="cuponRes__title texto-cupon-importante">{{infoDetalle.nombre}}</h4>
				<div class="cuponRes__barcode">
					<qrcode :value="resCompraData.serial" :options="{ size: 150 }" tag="img"></qrcode>
				</div>
				<div class="cuponRes__cupon texto-cupon-importante">
					<b>CÓDIGO: {{resCompraData ? resCompraData.serial.toUpperCase() : '' }}</b>
				</div>
				<div v-if="resCompraParams.length !== '0' && resCompraParams.length !== null">
					<b>Detalles</b>
					<div v-for="item in resCompraParams" :key="item.index">
						{{item.etiqueta}}: <span class="texto-cupon-importante">{{item.valor}}</span>
					</div>
				</div>
				<div>
					<b>Lugar</b>
					<p class="texto-cupon-importante">{{infoDetalle.lugar}}</p>
				</div>
				<div>
					<b>Horario</b>
					<p class="texto-cupon-importante">{{infoDetalle.horario}}</p>
				</div>
			</div>
		</el-dialog>

		<!-- Modal de envio a pasarela de pago -->
		<el-dialog width="60%" 	center :visible.sync="centerDialogEnviaPago" title="Aviso">
			<span>Este cupon tiene un costo adicional que podras pagar por medio de tu cuenta 
				de ahorros o tarjetas de credito si deseas continuar da clic en aceptar y sigue las
				instrucciones para hacerlo efectivo
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogEnviaPago = false">Cancel</el-button>
				<el-button type="primary" @click="continuarPago">Aceptar</el-button>
			</span>
		</el-dialog>

		<!-- Modal de confirmacion de compra -->
		<el-dialog width="60%" 	center :visible.sync="centerDialogConfirmarCompra" title="Aviso">
			<span>Esta seguro de comprar el cupon
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogConfirmarCompra = false">Cancel</el-button>
				<el-button type="primary" @click="comprar()">Aceptar</el-button>
			</span>
		</el-dialog>

		<!-- Modal para recargas -->
		<el-dialog width="60%" 	center :visible.sync="centerDialogRecarga" title="Comprar Cupón">
			<el-form v-model="valid">
				<div v-for="item in renderInputs" :key="item.id">
					<el-form-item v-if="item.tipoDato === 'dominio'" :label="item.etiqueta">
						<el-select v-model="datosPost[item.codigo].valor" filterable :placeholder="item.etiqueta">
							<el-option
								v-for="item in dominios(item.valorDefecto * 1)"
								:key="item.valor"
								:label="item.etiqueta"
								:value="item.valor">
							</el-option>
						</el-select>
					</el-form-item>  
					<el-form-item v-else-if="item.tipoDato == 'range' && item.isValorCupon == true">
						<span>{{item.etiqueta}}</span>
						<el-slider
							v-model="datosPost[item.codigo].valor" @input="rango(datosPost[item.codigo].valor, item.factorConversion)"
							:min="item.valorMin"
							:max="item.valorMax"
							:step="1000"
							show-stops>
						</el-slider>
					</el-form-item>
					<el-form-item v-else :label="item.etiqueta" :class="item.visible === true ? 'visible' : 'hiden'">
						<el-input :placeholder="item.etiqueta" v-model="datosPost[item.codigo].valor" ></el-input>
					</el-form-item>
				</div>
				<!--<div>Puntos a Redimir: {{rango(rangeValue / rangeConversion).toFixed(0)}} [PK]</div>
				<div>Valor a recargar: ${{ rangeValue.toFixed(0) }}</div>-->
				<div>Puntos a Redimir: {{parseFloat(rangeValue / rangeConversion).toFixed(0)}} [PK]</div>
        <div>Valor a recargar: ${{ rangeValue.toFixed(0) }}</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogRecarga = false">Cancel</el-button>
				<el-button type="primary" @click="centerDialogRecarga = false">Confirm</el-button>
			</span>
		</el-dialog>

		<!-- Modad de Error -->
		<div class="error">
			<el-dialog width="60%" 	center :visible.sync="centerDialogError" title="Error">
				<div style="color:red;">{{ error }}</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="centerDialogError = false">Aceptar</el-button>
				</span>
			</el-dialog>
		</div>
	</section>
</template>

<style>
@media (max-width: 400px){
	.card-cupon{
		width: 270px !important;
	}
	.boton-comprar{
		width: 30%;
		font-size: 12px
	}
	.boton-detalle{
		font-size: 12px;
	}
}
@media (max-width: 1000px) and (min-width:401px) {
	.card-cupon{
		width: 190% !important;
	}
}
.boton-cupon {
    margin: 10% auto;
    text-align: center;
    border: 1px black;
    border-radius: 50%;
    background: #2125298c;
    color: white;
    padding: 10%;
		cursor: pointer;
}
.botones {
    position: absolute;
    display: flex;
    color: black;
}
.card-cupon{
	position: relative;
	width: 100%;
}
.texto-cupon{
	color: white;
}
.imagen-cupon{
	width: 100%
}
.puntosKaptar{
	position: absolute;
	right: 0;
	background: #f0921e;
	padding: 6px;
	font-size: 14px;
	font-weight: 600;
	color: #fff;
	border-radius: 5px 0 5px 5px;
	z-index: 9;
	bottom: 0;
}
.boton-comprar {
	background: #f0921e;
	color: white;
	margin: 2%;
	border-bottom-right-radius: 15px;
	border-top-left-radius: 15px;
}
.boton-detalle {
	margin: 2%;
	border-bottom-right-radius: 15px;
	border-top-left-radius: 15px;
}
#titulo-Categoria {
	margin-bottom: 3%;
	font-size: 22px;
	color: #1ABAE8;
	font-weight: 700;
	vertical-align: middle;
}
</style>


<script>
import axios from 'axios'
export default {
	data () {
		return {
			cupones: this.$store.state.cupones,
			cuponesFiltrados: '{ "data": [',
			mostrarBoton: false,
			infoDetalle: null,
			centerDialogVisible: false,
			centerDialogConfirmarCompra: false,
			url: this.$store.state.metodoApi,
			resCompraData: '',
			respuestaCompra: null,
			centerDialogCompraCupon: false,
			resCompraParams: [],
			urlPago: null,
			centerDialogEnviaPago: false,
			centerDialogRecarga: false,
			valid: true,
			renderInputs: [],
			paramsOut: [],
			datosPost: {},
			rangeValue: 0,
			rangeConversion: 0,
			validRules: [
				(v) => !!v || 'Este campo es requerido'
			],
			centerDialogError: false
		}
	},
	computed:  {
		error () {
			return this.$store.state.error
		},
		tituloCategoria () {
			return this.$store.state.nombreCategoria
		}
	},
	watch: {
		error: function (val) {
			return this.$store.state.error
		},
		tituloCategoria: function (val) {
			return this.$store.state.nombreCategoria
		}
	},
	mounted () {
		let filtro = this.$store.state.filtroCategoria
		let cupones = this.$store.state.cupones
		for (let i = 0; i< cupones.length; i++) {
			for (let j = 0; j < cupones[i].categorias.length; j++){
				if (filtro === cupones[i].categorias[j].categoria && cupones[i].categorias[j].categoria !== 0) {
					if (this.cuponesFiltrados === '{ "data": [') {
						this.cuponesFiltrados += JSON.stringify(cupones[i])
					} else {
						this.cuponesFiltrados += ',' + JSON.stringify(cupones[i])
					}
				}
			}
		}
		this.cuponesFiltrados += ']}'
		this.cuponesFiltrados = JSON.parse(this.cuponesFiltrados).data
		this.$store.dispatch('actionGetDominio')
	},
	methods: {
		rango (valor, factorConversion) {
			this.rangeValue = valor * factorConversion
			this.rangeConversion = factorConversion
		},
		dominios (nombre) {
			if (!this.$store.state.valorDominio.get(nombre)) {
				return []
			}
			return this.$store.state.valorDominio.get(nombre)
		},
		visibleBotones () {
			this.mostrarBoton = true
		},
		detalle (item) {
			this.infoDetalle = item
			this.centerDialogVisible = true
		},
		confirmarCompra (item)
		{
			this.centerDialogConfirmarCompra = true
			this.infoDetalle = item
		},
		comprar () {
			this.centerDialogConfirmarCompra = false
      let filtro = '?filter={"where":{"idProducto":' + this.infoDetalle.id + '}}'
      axios.get(this.$store.state.endPoint + this.url.parametrosProducto + filtro)
      .then(resp => {
        if (resp.data.length !== 0) {
					this.renderInputs = []
					this.paramsOut = []
					resp.data.forEach(element => {
						if (element.tipoParametro === 'in') {
							var elem = {
								idParametro: element.id,
								idProducto: element.idProducto,
								nombre: element.codigo,
								valor: element.valorDefecto,
								estado: true
							}
							this.$set(this.datosPost, element.codigo, elem)
							this.renderInputs.push(element)
						} else {
							this.paramsOut.push(element)
						}
					})
					this.centerDialogRecarga = true
        } else {
        this.comprarCupones()
        }
      }).catch(err => {
        console.log('error parametro productos')
      })
		},
		comprarCupones () {
			var payload = {
				idUsuario: this.$store.state.user.id + '',
				idUsuarioVenta: this.$store.state.user.id + '',
				idLugarCompra: '-1',
				cantidad: '1',
				data: '[]'
			}
			let urlCupon = this.url.cuponCompra.replace('{idCupon}', this.infoDetalle.id)
			axios.post(this.$store.state.endPoint + urlCupon, payload)
			.then(resp => {
				if (resp.data.cupon[0].respuesta === 'error') {
					this.$store.commit('setError', resp.data.cupon[1].mensaje)
					this.centerDialogError = true
				} else	if (resp.data.cupon[1].respuesta === 'ok') {
					// Se valida si se puede pagar por mercado pago
					if (resp.data.cupon[0].cupon.estadoNegocio === 'I'){
						let urlPago = resp.data.cupon[0].cupon.urlPago
						this.urlPago = urlPago
						this.centerDialogEnviaPago = true
					} else {
						this.cuponUsuarios(resp.data.cupon[0].cupon.id)
					}
				}
				let user = { id: resp.data.cupon[0].cupon.idUsuario}
				this.$store.dispatch('actionActualizarInfoUsuario', user)
			}).catch(err => {
				console.log('error en la compra', err)
			})
		},
		// Buscar cupon comprado
		cuponUsuarios (id) {
			let urlCupon = this.url.cuponUsuario.replace('{id}', id)
			let filtro = '?filter={"include":{"relation":"parametros"}}'
			axios.get(this.$store.state.endPoint + urlCupon + filtro)
			.then(resp => {
				this.resCompraData = resp.data
				resp.data.parametros.forEach(paramCuponUsr => {
					this.paramsOut.forEach(paramsOut => {
						if (paramsOut.codigo === paramCuponUsr.nombre && paramsOut.visible === true) {
							var item = {
								etiqueta: paramsOut.etiqueta,
								valor: paramCuponUsr.valor
							}
							this.resCompraParams.push(item)
						}
					})
				})
				this.centerDialogCompraCupon = true
			}).catch(err => {
				console.log('no se encontro ningun cupon')
			})
		},
		continuarPago () {
			window.location.href = this.urlPago
		}
	}
}
</script>


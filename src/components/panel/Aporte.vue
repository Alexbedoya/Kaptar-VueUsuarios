<template>
  <section id="main-aporte">
		<h3 class="title-page__text" style="margin-bottom: 30px;">Últimas transaciones</h3>
		<div width="100%" v-show="false">
			<el-row>
				<el-col style="width:30%" class="fila-table">
					<span class="titulo-tabla-aporte">Transacción</span>
				</el-col>
				<el-col style="width:30%" class="fila-table">
					<span class="titulo-tabla-aporte">Fecha</span>
				</el-col>
				<el-col style="width:20%" class="fila-table">
					<span class="titulo-tabla-aporte">Aporte</span>
				</el-col>
				<el-col style="width:20%" class="fila-table">
					<span class="titulo-tabla-aporte">Detalle</span>
				</el-col>
			</el-row>
		</div>
		<div id="table-aporte" width="100%" v-show="false">
			<el-row v-for="txUser in transaciones" :key="txUser.id" class="fila-table">
				<el-col style="width:30%" >
					<span >{{txUser.producto}}</span>
				</el-col>
				<el-col style="width:30%" >
					<span >{{moment(txUser.fecha, 'YYYY-MM-DD')}}</span>
				</el-col>
				<el-col style="width:20%" >
					<div v-if="txUser.tipo === 'venta'">
						<img src="../../assets/menu/flecha-hacia-abajo.png" class="icono-aporte">
						<!--<i class="material-icons i__red">arrow_downward</i>-->
						<span style="margin-left: 10px" class="i__red">-{{ txUser.puntos }}</span>
					</div>
					<div v-else >
						<!--<i class="material-icons i__green">arrow_upward</i>-->
						<img src="../../assets/menu/flecha-hacia-arriba.png" class="icono-aporte">
						<span style="margin-left: 10px" class="i__green">{{ txUser.puntos }}</span>
					</div>
				</el-col>
				<el-col style="width:20%; cursor:pointer">
					<div v-if="txUser.tipo === 'venta'">
						<div @click="showCupon(txUser)"><i class="el-icon-search icono-aporte"></i></div>
					</div>
					<div v-else >
						<div @click="showTransacciones(txUser)"><i class="el-icon-plus icono-aporte"></i></div>
					</div>
				</el-col>
			</el-row>
		</div>

		<div>
			<b-table responsive striped hover :items="transaciones" :fields="fields" class="cursor-pointer">
				<template slot="producto" slot-scope="data">
				  <span @click="clickBalance(data.item)">{{data.item.producto}}</span>
			 	</template>
				<template slot="fecha" slot-scope="data">
					<span @click="clickBalance(data.item)" >{{moment(data.item.fecha, 'YYYY-MM-DD')}}</span>
				</template>
				<template slot="puntos" slot-scope="data">
					<span v-if="data.item.tipo === 'venta'" @click="clickBalance(data.item)" class="texto-rojo center">
						<vue-numeric read-only separator="," v-model="data.item.puntos"></vue-numeric> PK
					</span>
					<span v-else class="texto-verde center" @click="clickBalance(data.item)">
						<vue-numeric read-only separator="," v-model="data.item.puntos"></vue-numeric> PK
					</span>
				</template>
				<template slot="tipo" slot-scope="data">
					<div v-if="data.item.tipo === 'venta'" class="cursor-pointer">
						<div @click="showCupon(data.item)"><i class="el-icon-search icono-aporte"></i></div>
					</div>
					<div v-else class="cursor-pointer">
						<div @click="showTransacciones(data.item)"><i class="el-icon-plus icono-aporte"></i></div>
					</div>
				</template>
			</b-table>
		</div>

		<!--modal cupon -->
		<div v-if="resCompraParams.length !== 0" style="color:gray;">
			<el-dialog width="60%" center :visible.sync="centerDialogCupon" title="Detalle Compra Cupón">
				<div id="body-cupon">
					<h4 class="cuponRes__title texto-cupon-importante">{{resCompraParams.cupon.nombre}}</h4>
					Válido hasta el <b class="texto-cupon-importante">{{moment(resCompraParams.cupon.finVigencia,'DD-MMM-YYYY')}}</b>
					<div class="cuponRes__barcode">
						<qrcode :value="resCompraParams.serial" :options="{ size: 150 }" tag="img"></qrcode>
					</div>
					<div class="cuponRes__cupon texto-cupon-importante">
						<b>CÓDIGO: {{resCompraParams ? resCompraParams.serial.toUpperCase() : '' }}</b>
					</div>
					<div v-if="detalleRecarga.length !== 0 && detalleRecarga.length !== null">
						<b>Detalles</b><br>
						<span>Número de recarga: {{detalleRecarga[1].valor}}</span><br>
						<span>Valor de Recarga: {{detalleRecarga[2].valor}}</span><br>
					</div>
					<div v-if="detalleEnergia.length !== 0 && detalleRecarga.length !== null" >
						<b>Detalle</b><br>
						<div v-for="item in detalleEnergia" :key="item.id">
							<span>{{item.nombre}}: <span class="texto-cupon-importante">{{item.valor}}</span></span>
						</div>
					</div>
					<div>
						<b>Lugar</b>
						<p class="texto-cupon-importante">{{resCompraParams.cupon.lugar}}</p>
					</div>
					<div>
						<b>Horario</b>
						<p class="texto-cupon-importante">{{resCompraParams.cupon.horario}}</p>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="centerDialogCupon = false">Cerrar</el-button>
				</span>
			</el-dialog>
		</div>

		<div v-if="resTransaccionUsuario !== ''">
			<el-dialog :visible.sync="showTransaccionUsuario" width="60%" center title="Detalle Deposito">
				<b-table responsive striped hover :items="resTransaccionUsuario"></b-table>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="showTransaccionUsuario = false">Cerrar</el-button>
				</span>
			</el-dialog>
		</div>
	</section>
</template>

<style>
#table-transaccion{
	max-height: 300px;
	overflow-y: auto;
}
#body-cupon{
	text-align: center;
}
.icono-aporte{
	width: 20px;
  height: 20px;
	margin-left: 25%;
}
#main-aporte{
	width: 80%;
	margin: 0 auto;
	min-height: 408px;
}
#table-aporte{
	background: white;
	min-height: 200px;
	max-height: 560px;
	overflow-y: auto;
}
.titulo-tabla-aporte{
	color: #909399;
	font-weight: 500;
	font-size: 24px;
	padding: 0px 10px;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.fila-table{
	border-bottom: 1px #909399 solid;
	height: 50px;
}
.texto-rojo{
	color: red;
}
.texto-verde{
	color: green;
}
.center {
	text-align: center;
}
.cursor-pointer {
	cursor: pointer;
}
.table {
	color: #6c757d !important;
}
.table-striped tbody tr:nth-of-type(odd) {
	background-color: rgb(181, 225, 210) !important;
}
.table-hover tbody tr:hover {
    background-color: rgb(181, 225, 210) !important;
}
.cuponRes__barcode {
	margin: 15px
}
.texto-cupon-importante {
    color: #00bbec;
}
</style>


<script>
var moment = require('moment-timezone')
import axios from 'axios'
export default {
	data () {
		return {
			fields: ['producto', 'fecha', 'puntos', 'tipo'],
			resCompraParams: [],
			resTransaccionUsuario: '',
			detalleRecarga: [],
			detalleEnergia: [],
			totalBotellas: [],
			centerDialogCupon: false,
			showTransaccionUsuario: false,
			endPoint: this.$store.state.endPoint,
			metodoApi: this.$store.state.metodoApi
		}
	},
	computed: {
		transaciones () {
			if (!this.$store.state.getTxUsuario) {
				return ''
			}
			return this.$store.state.getTxUsuario
		},
	},
	methods: {
		moment (date, formato) {
			// var ftoHora = hora ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
			return moment(date).format(formato)
		},
		clickBalance(item){
			console.log(item)
			if (item.tipo === 'venta') {
				this.showCupon(item)
			} else {
				this.showTransacciones(item)
			}
		},
		showCupon (item) {
			this.resCompraParams = []
			let filter = '?filter={"include":["parametros",{"relation": "cupon","scope": {"include": ["parametro"]}}]}'
			axios.get(this.endPoint + this.metodoApi.cuponUsuario.replace('{id}', item.id) + filter)
			.then(resp => {
				this.resCompraParams = resp.data
				this.detalleEnergia = []
				if (resp.data.datos === null) {
					this.detalleRecarga = []
					// this.detalleEnergia = resp.data.cupon.parametro
					for (let i = 0; i < resp.data.cupon.parametro.length; i++) {
						if (resp.data.cupon.parametro[i].visible === true) {
							for (let j = 0; j< resp.data.parametros.length; j++) {
								if (resp.data.cupon.parametro[i].codigo === resp.data.parametros[j].nombre) {
									let item = {
										nombre: resp.data.cupon.parametro[i].etiqueta,
										valor: resp.data.parametros[j].valor
									}
									this.detalleEnergia.push(item)
								}
							}
						}
					}
				} else {
					this.detalleRecarga = JSON.parse(resp.data.datos)
				}
				this.centerDialogCupon = true
			}).catch(err => {
				console.log("error mostrar cupon", err)
			})
		},
		showTransacciones (item) {
			this.resTransaccionUsuario = []
			let filter = '?filter={"include":[{"relation": "detalles","scope": {"include": ["detalleProducto"]}}]}'
			axios.get(this.endPoint + this.metodoApi.transaccionRvms.replace('{id}', item.id) + filter)
			.then(resp => {
				this.totalBotellas = resp.data.cantidad
				var detalleTransaccion = resp.data.detalles
				detalleTransaccion.forEach(carcProducto => {
					try {
						var auxT = resp.data.tipoTransaccion * 1
						if (auxT !== 5) {
							var conjuntoDetalles = {
								nombre: carcProducto.detalleProducto.nombre,
								cantidad: carcProducto.cantidad,
								empresa: carcProducto.detalleProducto.empresa
							}
						} else {
							conjuntoDetalles = {
								nombre: carcProducto.producto,
								cantidad: carcProducto.cantidad,
								empresa: 'Pila'
							}
						}
						this.resTransaccionUsuario.push(conjuntoDetalles)
					} catch (error) {
						console.error(error)
					}
				})
				this.showTransaccionUsuario = true
			}).catch(err => {
				console.log('error transaccion', err)
			})
		}
	}
}
</script>


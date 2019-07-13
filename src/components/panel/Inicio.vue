<template>
	<section style=" width:80%; margin:0 auto; overflow-x: hidden;">
		<el-container>
			<div id="texto-inicio">
				Descubre todo lo que tenemos para ti
			</div>
		</el-container>
		<el-container>
			<el-row>
				<el-col :xs="6" :sm="3" :md="3" v-for="item in categoria" :key="item.id" style="margin: 0 28px 10px 28px;"> <!--:offset="item.id > 0 ? 2 : 0"-->
					<el-card :body-style="{ padding: '0px' }" shadow="hover" class="card-categoria">
						<img :src="item.icono" class="image" @click="mostrarCupon(item)">
						<div style="padding: 14px;">
							<div class="bottom clearfix sm-5 texto-categoria">
								{{ item.nombre }}
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</el-container>
		<div class="block" style="margin-top:8%">
			<el-carousel height="">
				<el-carousel-item v-for="item in Destacados" :key="item.id">
					<img :src="item.urlInterna" style="width:100%">
				</el-carousel-item>
			</el-carousel>
 		</div>
	</section>
</template>



<style>
.el-carousel__indicators.el-carousel__indicators--horizontal {
  visibility: hidden;
}
.el-carousel__container {
  height: 400px;
	width: 80%;
  margin: 0 auto;
}
.el-carousel__container >img {
  width: 100%;
}
@media (min-width:401px) and (max-width: 600px) {
	.el-carousel__container {
		height: 200px;
	}
}
@media (min-width:601px) and (max-width: 800px)  {
	.el-carousel__container {
		height: 300px;
	}
}
@media (max-width:400px) {
	.el-card {
		width: 100px !important;
	}
	.texto-categoria {
		font-size: 10px;
	}
	.el-carousel__container {
		height: 100px;
	}
}
@media (min-width:400px) {
	#destacados {
		width: 80%;
		margin: 0 auto;
	}
}
.el-card {
	width: 142px;
}
.card-categoria:hover {
  background: #1da1f245;
	cursor: pointer;
}
.texto-categoria{
  color:#1da1f2;
  text-align: center;
}
#texto-inicio {
	margin-bottom: 3%;
	font-size: 22px;
 	color: #1ABAE8;
  font-weight: 700;
	margin-left: 30px;
}
.imagen-anuncio {
	width: 100%;
}
ul.el-carousel__indicators.el-carousel__indicators--horizontal.el-carousel__indicators--outside {
    display: none;
}
</style>

<script>
import Axios from 'axios'
export default {
	name: 'CarouselPage',
	data () {
		return {
			categoria: null,
			destacados: null
		}
	},
	mounted () {
		this.categorias()
		this.$store.dispatch('actionCupon')
	},
	computed: {
		Destacados () {
			return this.$store.state.destacados
		}
	},
	watch: {
		Destacados: function (val) {
			return this.$store.state.destacados
		}
	},
	methods: {
		categorias () {
			let url = this.$store.state.metodoApi
			Axios.get(this.$store.state.endPoint + url.categoria)
			.then(resp => {
				this.categoria = resp.data
				this.$store.dispatch('actionCategoria', resp.data)
				this.$store.dispatch('actionGetCuponesDestacados')
			}).catch(err => {
				console.log('error categorias', err)
			})
		},
		mostrarCupon: function ( filtro ) {
			console.log(filtro)
			this.$store.state.nombreCategoria = filtro
			this.$store.state.filtroCategoria = filtro.id
			this.$router.push('/cuponera')
		}
	}
}
</script>


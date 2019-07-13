<template>
  <section>
		hola has procesado tu pago

		Comprobante de Pago 
		{{ uid.uid }}
	</section>
</template>

<script>
export default {
	data () {
		return {
			uid: null
		}
	},
	mounted () {
		let login = sessionStorage.getItem('login')
		this.$store.dispatch('actionLoginUserMercadoPago', JSON.parse(login))
		this.uid = this.$route.query
	}
}
</script>


<template>
  <MainTemplate/>
</template>

<script>
import MainTemplate from '@/components/MainTemplate.vue';
// import { useRouter } from 'vue-router'
import moment from 'moment';

export default {
  name: 'App',
  components: {
    MainTemplate
  },
  data(){
    return {
      isTokenValid: true
    }
  },
  computed: {
    dateNow(){
      return moment().format('DD.MM.YYYY HH:mm:ss')
    },
  },
  methods: {
    async checkToken(){
      await this.callApi();
      const token = localStorage.getItem('token');
      // const currentRoute = this.$route
      
      if(!this.isTokenValid || !token){
        this.$router.replace({name: 'home'})
      }
      console.log('check 1')
    },
    async callApi(){
      this.$root.connector.refresh()
        .then(res => {
          this.isTokenValid = true
          localStorage.setItem('lastRefreshToken', JSON.stringify(this.dateNow))
          localStorage.setItem('token', JSON.stringify(res.headers.authorization))
          console.log('call 1')
        })
        .catch(err => {
          this.isTokenValid = false
          console.log('call 2')
        })
    }
  },
  mounted(){
    // this.callApi()
    this.checkToken()
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
}
</style>

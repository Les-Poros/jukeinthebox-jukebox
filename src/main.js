import Vue from 'vue'
import App from './App.vue'
import Login from './Login.vue'
new Vue({
  el: '#app',
  data:{
    url:"https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/",
    token:""
  },
  components: { App,Login }
})

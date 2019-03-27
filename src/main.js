import Vue from 'vue'
import App from './App.vue'
import Login from './Login.vue'

import conf from "./conf/conf.json"

new Vue({
  el: '#app',
  data:{
    url:conf.apiUrl,
    musicurl:conf.musicUrl,
    token:""
  },
  components: { App,Login }
})

var modal = new Vue({
    el: '.modal',
    data: {
      token:"",
      unshow: false
    },
    methods: {
        disparait : function(){
            this.unshow=true;
            content.recupFile();
            setInterval(function () { content.recupFile(); }, 5000);
        }
    },
    computed: {

    },
    created() {
    }
  });
var content = new Vue({
  el: '.main-container',
  data: {
    file: "",
    idmusic: "",
    music: "",
    sound: "",
    timer: "",
    actTimer:"",
    duration: "",
    pourcentage:"",
    firstMusic:""
  },
  methods: {
    recupFile: function () {
      axios
        .get('https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/File', {
          context: document.body,
          params: {
            "bartender": modal.token
          }
        })
        .then((response) => {
          if (response.data != this.file) {
            this.file = response.data;
            if (this.file.pistes.length > 0) {
              if (this.file.pistes[0]["idFile"] != this.idmusic) {
                this.firstMusic=this.file.pistes[0]["piste"];
                this.idmusic = this.file.pistes[0]["idFile"];
                this.nomMusic();
                this.playFirstMusic();
              }
            }
            else {
              this.firstMusic="";
              this.idmusic ="";
            }
          }
        });
    },
    nomMusic: function (piste) {
      let musique = "";
      this.firstMusic["artistes"].forEach(artiste => {
        musique += artiste["nom"];
      });
      musique += "-" + this.firstMusic["nomPiste"];
      var regex = /\'/gi;
      musique = musique.replace(regex, '');
      this.music=musique;
    },
    playFirstMusic: function () {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function (blob) {
        if (xhr.status == 200) {
          content.sound = new Howl({
            src: [window.URL.createObjectURL(xhr.response)],
            format: ["mp3"]
          });
          content.sound.on("play", function () {
              content.duration = this.duration();
              content.renderTimer();
            });
            content.sound.on("end", function () {
              content.nextMusic();
            });
            content.sound.play();
        }
      });
      xhr.open('GET', 'https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/musique/' + this.music + '.mp3');
      xhr.responseType = 'blob';
      xhr.send(null);
    },
    renderTimer: function () {
      if(this.sound!="")
      this.actTimer=this.sound.seek();
      this.pourcentage = (this.actTimer / this.duration) * 100 + "%";
      this.timer = setTimeout(function () {
        content.renderTimer()
      }, 1000)
    },
    tempsMinute: function (secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = (secs - minutes * 60) || 0;
      return minutes + ':' + (seconds < 10 ? '0' : '') + Math.round(seconds);
    },
    nextMusic: function () {
      const params = new URLSearchParams();
      params.append('token', token);
      axios
        .delete('https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/next', {
          params: {
            'bartender': modal.token,
          }
        })
        .then(() => {
          this.clearMusic();
          this.recupFile();
        });
    },
    clearMusic: function () {
      this.actTimer="";
      this.duree="";
      this.duration = "";
      this.pourcentage="";
      clearTimeout(this.timer);
      Howler.unload();
    },
  },
  computed: {
  },
  created() {
  }
});
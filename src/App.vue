<template>
  <div class="main-container">
    <div class="prev">
      <div style="overflow : hidden">
        <h3>Ont été jouées</h3>
        <span v-cloak v-for="(piste,index) in pistesPrev" v-bind:key="index">
          <div class="pistePassee">
            <img :src="piste.imagePiste">
            <p><span>
              <span v-for="(artiste,index2) in piste.artistes" v-bind:key="index2">
              <span v-if="index2 != 0"> /</span>
                {{artiste.prénom}} {{artiste.nom}}</span>
            </span> - {{piste.nomPiste}}</p>
          </div>
        </span>
      </div>
    </div>
    <div class="act">
      <div v-cloak v-if="blindtest && actTimer<25 && firstMusic">Essayez de deviner la musique <img src="https://cdn.discordapp.com/attachments/506130598515965953/562975846680494089/music-player.png" style="height: 20px;"/></div>
      <div v-cloak v-else class="info">
        <div>
          <img :src="firstMusic.imagePiste" v-if="firstMusic.imagePiste!=null">
        </div>
        <h1 v-if="firstMusic.nomPiste!=null">{{firstMusic.nomPiste}}</h1>
        <h1 v-else>Pas de musique</h1>
        <hr>
        <h3>
          <span v-for="(artiste,index) in firstMusic.artistes" v-bind:key="index">
            <span v-if="index != 0">/</span>
            {{artiste.prénom}} {{artiste.nom}}
          </span>
        </h3>
        <hr>
        <h3>
          <span v-for="(genre,index) in firstMusic.genres" v-bind:key="index">
            <span v-if="index != 0">/</span>
            {{genre}}
          </span>
        </h3>
      </div>
      <div v-cloak class="temps">
        <div v-if="duration" class="barre">
          <div class="timer">
            {{tempsMinute(actTimer)}}
            <span v-if="action=='pause'">PAUSE</span>
          </div>
          <div class="pourcentage" v-bind:style="{width:pourcentage}"></div>
          <div class="duration">{{tempsMinute(duration)}}</div>
        </div>
        <div v-else-if="firstMusic">Chargement ...</div>
      </div>

      <h3 v-cloak class="delimitAlbum">Apparaît dans :</h3>
      <div v-cloak v-if="blindtest && actTimer<25 && firstMusic">Si vous trouvez les albums, vous êtes le meilleur !</div>
      <div v-else class="albums">
        <div class="album" v-for="(album,index) in firstMusic.albums" v-bind:key="index">
          <img v-cloak :src="album.imageAlbum">
          <p v-cloak class="nom">{{album.nomAlbum}}</p>
          <p v-cloak class="artiste">
            par
            <span v-for="(artiste,index) in album.artistes" v-bind:key="index">
              <span v-if="index != 0">/</span>
              {{artiste.prénom}} {{artiste.nom}}
            </span>
          </p>
          <p v-cloak class="genre">
            <span v-for="(genre,index) in album.genres" v-bind:key="index">
              <span v-if="index != 0">/</span>
              {{genre}}
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="next" v-on:click="nextMusic()">
      <div style="overflow : hidden" v-if="!blindtest">
        <h3>Musiques suivantes</h3>
        <span v-cloak v-for="(piste,index) in file.pistes" v-bind:key="index">
          <div v-if="index!=0" class="pisteFile">
            <img :src="piste.piste.imagePiste">
            <p>{{piste.piste.nomPiste}}</p>
          </div>
        </span>
      </div>
      <qrcode-vue :value="qrcode" size="200" style="margin: auto auto 0 auto ; padding : 20px"></qrcode-vue>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Howl, Howler } from "howler";
import QrcodeVue from "qrcode.vue";
export default {
  name: "app",
  props: ["url", "token", "musicurl"],
  data() {
    return {
      file: "",
      idmusicfile: "",
      music: "",
      soundId: "",
      sound: "",
      timer: "",
      actTimer: "",
      duration: "",
      pourcentage: "",
      firstMusic: "",
      qrcode: "",
      action: "",
      blindtest: "",
      pistesPrev: []
    };
  },
  components: {
    QrcodeVue
  },
  methods: {
    recupFile: function() {
      axios
        .get(this.url + "File", {
          context: document.body,
          params: {
            bartender: this.token
          }
        })
        .then(response => {
          if (response.data != this.file) {
            this.file = response.data;
            if (this.file.pistes.length > 0) {
              if (this.file.pistes[0]["idFile"] != this.idmusicfile) {
                this.firstMusic = this.file.pistes[0]["piste"];
                this.idmusicfile = this.file.pistes[0]["idFile"];
                this.nomMusic();
                this.playFirstMusic();
                const params = new URLSearchParams();
                params.append("bartender", this.token);
                params.append("idPiste", this.firstMusic["idPiste"]);
                axios.post(this.url + "pushStatsMusic", params);
              }
            } else {
              this.firstMusic = "";
              this.idmusicfile = "";
            }
          }
        });
    },
    nomMusic: function(piste) {
      let musique = "";
      let artistes = "";
      this.firstMusic["artistes"].forEach(artiste => {
        artistes += artiste["nom"];
      });
      musique += "-" + this.firstMusic["nomPiste"];
      var regex = /\'/gi;
      musique = musique.replace(regex, "");
      regex = /\ /gi;
      musique = musique.replace(regex, "_");
      this.music = artistes + musique;
    },
    generateQrCode: function() {
      this.qrcode =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      const params = new URLSearchParams();
      params.append("bartender", this.token);
      params.append("qrcode", this.qrcode);
      axios.post(this.url + "qrcode", params);
      let self = this;
      setTimeout(function() {
        self.generateQrCode();
      }, 3600000);
    },
    playFirstMusic: function() {
      var xhr = new XMLHttpRequest();
      const content = this;
      xhr.addEventListener("load", function(blob) {
        if (xhr.status == 200) {
          content.sound = new Howl({
            src: [window.URL.createObjectURL(xhr.response)],
            format: ["mp3"]
          });
          content.sound.on("load", function() {
            if (content.blindtest) {
              content.duration = 30;
              content.actTimer = 0;
            } else content.duration = this.duration();
            if (content.action == "play") content.play();
          });
          content.sound.on("end", function() {
            content.nextMusic();
          });
        }
      });
      xhr.open("GET", this.musicurl + this.music + ".mp3");
      xhr.responseType = "blob";
      xhr.send(null);
    },
    renderTimer: function() {
      if (this.sound != "")
        if (this.blindtest)
          if (this.actTimer >= 30) this.nextMusic();
          else this.actTimer++;
        else this.actTimer = this.sound.seek();
      this.pourcentage = (this.actTimer / this.duration) * 100 + "%";
      const content = this;
      this.timer = setTimeout(function() {
        content.renderTimer();
      }, 1000);
    },
    tempsMinute: function(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = secs - minutes * 60 || 0;
      return minutes + ":" + (seconds < 10 ? "0" : "") + Math.round(seconds);
    },
    nextMusic: function() {
      if (this.pistesPrev.length < 5 ) {
        this.pistesPrev.push(this.firstMusic);
      }
      else if (this.pistesPrev.length == 5) {
        this.pistesPrev.splice(0, 1);
        this.pistesPrev.push(this.firstMusic);
      }
      if (this.firstMusic)
        axios
          .delete(this.url + "next", {
            params: {
              bartender: this.token
            }
          })
          .then(() => {
            this.clearMusic();
            this.recupFile();
          });
      else this.clearMusic();
    },
    clearMusic: function() {
      this.actTimer = "";
      this.duree = "";
      this.duration = "";
      this.pourcentage = "";
      this.sound = "";
      clearTimeout(this.timer);
      Howler.unload();
    },
    play: function() {
      if (this.sound != "" && !this.sound.playing(this.soundId)) {
        this.soundId = this.sound.play();
        if (this.blindtest && this.actTimer == 0) {
          this.sound.seek(30);
        }
        this.renderTimer();
      }
    },
    pause: function() {
      if (this.sound != "") {
        clearTimeout(this.timer);
        this.sound.pause();
      }
    },
    repeat: function() {
      if (this.sound != "") {
        if (this.blindtest) {
          this.actTimer = 0;
          this.sound.seek(30);
        } else this.sound.seek(0);
      }
      const params = new URLSearchParams();
      params.append("bartender", this.token);
      axios.post(this.url + "play", null, { params: params });
    },
    actionJukebox: function() {
      axios
        .get(this.url + "getJukeboxAction", {
          context: document.body,
          params: {
            bartender: this.token
          }
        })
        .then(response => {
          if (response.data.blindtest != this.blindtest) {
            if (this.blindtest !== "") {
              this.blindtest = response.data.blindtest;
              this.nextMusic();
            } else this.blindtest = response.data.blindtest;
          }
          if (response.data.action != this.action) {
            this.action = response.data.action;
            switch (this.action) {
              case "play":
                this.play();
                break;
              case "pause":
                this.pause();
                break;
              case "next":
                this.nextMusic();
                break;
              case "repeat":
                this.repeat();
                break;
            }
          }
        });
    }
  },
  created() {
    const params = new URLSearchParams();
    params.append("bartender", this.token);
    axios.post(this.url + "play", null, { params: params });
    this.actionJukebox();
    this.generateQrCode();
    this.recupFile();
    setInterval(() => {
      this.recupFile();
    }, 5000);
    setInterval(() => {
      this.actionJukebox();
    }, 1000);
  }
};
</script>

<style>
body {
  margin: 0;
  background-color: #e4e4e4;
}
h3,
h1 {
  margin: 0;
}
.main-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.act {
  margin: auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  width: 80%;
}

.info {
  border: gray solid 1px;
  background-color: #dae2fe;
  width: fit-content;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
}

.info .genre {
  margin: 0;
  font-size: 1.5em;
}

.info img {
  width: 300px;
  height: 300px;
}

.temps {
  margin: auto;
  margin-top: 5%;
  width: 50%;
}
.barre {
  display: flex;
  align-items: center;
  width: 100%;
  height: 1.5em;
  border-radius: 0.5em;
  position: relative;
  background: #f2f2f2;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.unshow {
  visibility: hidden;
}
[v-cloak] {
  display: none;
}
.modal {
  /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.modal-content {
  background-color: gray;
  margin: 40vh 0 0 40vw; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: fit-content; /* Could be more or less, depending on screen size */
}

.barre .pourcentage {
  position: absolute;
  width: 0%;
  font-size: 1.5em;
  background: tomato;
  height: 1em;
  border-radius: 0.5em;
}

.timer,
.duration {
  z-index: 1;
}
.timer {
  margin-left: 10px;
  margin-right: auto;
}
.duration {
  margin-left: auto;
  margin-right: 10px;
}

.delimitAlbum {
  margin-top: 5%;
}

.albums {
  margin-top: 2%;
  display: flex;
  justify-content: space-evenly;
}

.album {
  display: grid;
  grid-template-areas:
    "img titre"
    "img artiste"
    "img genre";
  width: 33%;
  grid-template-columns: 150px 1fr;
  background-color: #456072;
  color: white;
  border: solid 1px #0f2636;
  border-radius: 10px;
  overflow: hidden;
}
.album p {
  margin: auto;
  margin-left: 10px;
  text-align: left;
  font-size: 1em;
}
.album .genre {
  grid-area: genre;
}

.album .nom {
  grid-area: titre;
  font-weight: bold;
  text-decoration: underline;
}

.album .artiste {
  grid-area: artiste;
}

.album img {
  width: 150px;
  height: 150px;
  grid-area: img;
}

.next {
  width: 20%;
  background-color: #456072;
  color: white;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.next h3 {
  margin: 10px;
}

.prev{
  width: 20%;
  background-color: #456072;
  color: white;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.prev h3 {
  margin: 10px;
}

.pisteFile {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 90%;
  height: 50px;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 50px 1fr;
  border: solid 1px #0f2636;
  background-color: #dae2fe;
  color: black;
  border-radius: 10px;
  overflow: hidden;
}

.pisteFile p {
  align-self: center;
  margin: 0;
}

.pisteFile img {
  width: 50px;
  height: 50px;
}

.pistePassee {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 90%;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 50px 1fr;
  border: solid 1px #0f2636;
  background-color: #dae2fe;
  color: black;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.pistePassee p {
  margin: 0;
  padding-left: 5px;
}

.pistePassee img {
  width: 50px;
  height: 50px;
}
</style>

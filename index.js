/*let music;
let idmusic;
let sound;
let duration;
let timer;
let file = "";

function recupFile() {
  $.ajax({
    url: "https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/File/1",
    context: document.body
  }).done(function (data) {
    if (data != file) {
      file = data;
      let json = data;
      if (json["pistes"][0] != null) {
        if (json["pistes"][0]["idFile"] != idmusic) {
          idmusic = json["pistes"][0]["idFile"];
          music = NomMusic(json["pistes"][0]["piste"]);
          playFirstMusic();
          descPiste(json["pistes"][0]["piste"]);
        }
        $(".next").html("<h3>Musique suivante</h3>");
        for (let i = 1; i < json["pistes"].length; i++) {
          pisteFile(json["pistes"][i]["piste"]);
        }
      }
      else {
        $(".info").html("Musique Actuelle : Aucune");
        $(".albums").html("Musique Actuelle : Aucune");
      }
    }
  });
}

function NomMusic(piste) {
  music = "";
  piste["artistes"].forEach(artiste => {
    music += artiste["nom"];
  });
  music += "-" + piste["nomPiste"];
  var regex = /\'/gi;
  music = music.replace(regex, '');
  return music;
}

function nextMusic() {
  $.ajax({
    url: 'https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/next/1',
    type: 'DELETE'
  });
  clearTimer();
  Howler.unload();
  recupFile();
}

function playFirstMusic() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function (blob) {
    if (xhr.status == 200) {
      sound = new Howl({
        src: [window.URL.createObjectURL(xhr.response)],
        onplay: function () {
          duration = sound.duration();
          Timer();
          $('.duration').html(tempsMinute(Math.round(duration)));
        },
        onend: function () {
          nextMusic();
        },
        format: ["mp3"]
      })
      sound.play();
    }
  });
  xhr.open('GET', 'https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/musique/' + music + '.mp3');
  xhr.responseType = 'blob';
  xhr.send(null);
};

function descPiste(piste) {
  let info = "<div><img src='" + piste["imagePiste"] + "'></div><h1>" + piste["nomPiste"] + "</h1><h3>";
  piste["artistes"].forEach(artiste => {
    info += artiste["prénom"] + " " + artiste["nom"] + " / "
  });
  info = info.substr(0, info.length - 2);
  info += " </h3><h3>";
  piste["genres"].forEach(genre => {
    info += genre + " / "
  });
  info = info.substr(0, info.length - 2);
  info += "</h3>";
  $(".info").html(info);

  let albums = "";
  piste["albums"].forEach(album => {
    albums += "<div class='album'><p class='nom'>" + album["nomAlbum"] + "</p> <p class='artiste'> par ";
    album["artistes"].forEach(artiste => {
      albums += artiste["prénom"] + " " + artiste["nom"] + " / ";
    });
    albums = albums.substr(0, albums.length - 2);
    albums += "<p class='genre'>";
    album["genres"].forEach(genre => {
      albums += genre + " / ";
    });
    albums = albums.substr(0, albums.length - 2);
    albums += "</p><img src='" + album["imageAlbum"] + "'></div>"
  });
  albums += "</div>";
  $(".albums").html(albums);
}

function pisteFile(piste) {
  let pisteFile = "<div class='pisteFile'><img src='" + piste["imagePiste"] + "'><p>" + piste["nomPiste"] + " - ";
  piste["artistes"].forEach(artiste => {
    pisteFile += artiste["prénom"] + " " + artiste["nom"] + " / ";
  });
  pisteFile = pisteFile.substr(0, pisteFile.length - 2) + "</p></div>";
  $(".next").append(pisteFile);
}

function tempsMinute(secs) {
  var minutes = Math.floor(secs / 60) || 0;
  var seconds = (secs - minutes * 60) || 0;

  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function Timer() {
  let seek = sound.seek()
  $('.timer').html(tempsMinute(Math.round(seek)));
  $('.pourcentage').css("width", (seek / duration) * 100 + "%");
  timer = setTimeout(function () {
    Timer()
  }, 1000)
}

function clearTimer() {
  $('.timer').html("");
  $('.duration').html("");
  clearTimeout(timer);
  duration = 0;
  $('.pourcentage').css("width", 0);
}

$(".next").click(function () {
  nextMusic();
});

recupFile();
setInterval(function () {
  recupFile();
}, 5000);*/

var content = new Vue({
  el: '.main-container',
  data: {
    file: "",
    idmusic: "",
    music: "",
    sound: "",
    timer: "",
    duration: "",
    timer: ""
  },
  methods: {
    recupFile: function () {
      axios
        .get('https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/File', {
          context: document.body,
          params: {
            "token": token
          }
        })
        .then((response) => {
          let data = response.data;
          let pistes = "";
          if (data != this.file) {
            this.file = data;
            let json = data;
            if (json.pistes.length > 0) {
              if (json.pistes[0]["idFile"] != this.idmusic) {
                this.idmusic = json.pistes[0]["idFile"];
                this.music = this.nomMusic(json.pistes[0]["piste"]);
                this.playFirstMusic();
                this.descPiste(json.pistes[0]["piste"]);
              }
              let next = document.getElementsByClassName('next');
              for (let i = 1; i < json.pistes.length; i++) {
                pistes += this.pisteFile(json.pistes[i]["piste"]);
              }
              next[0].innerHTML = "<h3>Musiques suivantes</h3>" + pistes;
            }
            else {
              let info = document.getElementsByClassName('info');
              info[0].innerHTML = "Musique Actuelle : Aucune";
              let albums = document.getElementsByClassName('albums');
              albums[0].innerHTML = "Musique Actuelle : Aucune";
            }
          }
        });
    },
    nomMusic: function (piste) {
      let musique = "";
      piste["artistes"].forEach(artiste => {
        musique += artiste["nom"];
      });
      musique += "-" + piste["nomPiste"];
      var regex = /\'/gi;
      musique = musique.replace(regex, '');
      return musique;
    },
    playFirstMusic: function () {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function (blob) {
        if (xhr.status == 200) {
          this.sound = new Howl({
            src: [window.URL.createObjectURL(xhr.response)],
            onplay: function () {
              this.duration = this.sound.duration();
              renderTimer();
              let duree = document.getElementsByClassName('duration');
              duree[0].innerHTML = tempsMinute(Math.round(this.duration));
            },
            onend: function () {
              this.nextMusic();
            },
            format: ["mp3"]
          });
          this.sound.play();
        }
      });
      xhr.open('GET', 'https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/musique/' + this.music + '.mp3');
      xhr.responseType = 'blob';
      xhr.send(null);
    },
    descPiste: function (piste) {
      let infosMusique = "<div><img src='" + piste.imagePiste + "'></div><h1>" + piste.nomPiste + "</h1><h3>";
      piste.artistes.forEach(artiste => {
        infosMusique += artiste.prénom + " " + artiste.nom + " / "
      });
      infosMusique = infosMusique.substr(0, infosMusique.length - 2);
      infosMusique += " </h3><h3>";
      piste.genres.forEach(genre => {
        infosMusique += genre + " / "
      });
      infosMusique = infosMusique.substr(0, infosMusique.length - 2);
      infosMusique += "</h3>";

      let albumsMusique = "";
      piste.albums.forEach(album => {
        albumsMusique += "<div class='album'><p class='nom'>" + album.nomAlbum + "</p> <p class='artiste'> par ";
        album.artistes.forEach(artiste => {
          albumsMusique += artiste.prénom + " " + artiste.nom + " / ";
        });
        albumsMusique = albumsMusique.substr(0, albumsMusique.length - 2);
        albumsMusique += "<p class='genre'>";
        album.genres.forEach(genre => {
          albumsMusique += genre + " / ";
        });
        albumsMusique = albumsMusique.substr(0, albumsMusique.length - 2);
        albumsMusique += "</p><img src='" + album.imageAlbum + "'></div>"
      });
      albumsMusique += "</div>";

      let info = document.getElementsByClassName('info');
      info[0].innerHTML = infosMusique;
      let album = document.getElementsByClassName('albums');
      album[0].innerHTML = albumsMusique;
    },
    pisteFile: function (piste) {
      let pisteFile = "<div class='pisteFile'><img src='" + piste.imagePiste + "'><p>" + piste.nomPiste + " - ";
      piste.artistes.forEach(artiste => {
        pisteFile += artiste.prénom + " " + artiste.nom + " / ";
      });
      pisteFile = pisteFile.substr(0, pisteFile.length - 2) + "</p></div>";
      return pisteFile;
    },
    renderTimer: function () {
      let seek = sound.seek();
      let timer = document.getElementsByClassName('timer');
      timer[0].innerHTML = tempsMinute(Math.round(seek));
      let pourcentage = document.getElementsByClassName('pourcentage');
      pourcentage[0].style.width = (seek / this.duration) * 100 + "%";
      this.timer = setTimeout(function () {
        renderTimer()
      }, 1000)
    },
    tempsMinute: function (secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = (secs - minutes * 60) || 0;
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    },
    nextMusic: function () {
      const params = new URLSearchParams();
      params.append('token', token);
      axios
        .delete('https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/next', {
          data: {
            'token': token,
          }
        })
        .then(() => {
          this.clearTimer();
          Howler.unload();
          this.recupFile();
        });
    },
    clearTimer: function () {
      let timer = document.getElementsByClassName('timer');
      timer[0].innerHTML = "";
      let duree = document.getElementsByClassName('duration');
      duree[0].innerHTML = "";
      clearTimeout(this.timer);
      this.duration = 0;
      let pourcentage = document.getElementsByClassName('pourcentage');
      pourcentage[0].style.width = 0;
    },
  },
  computed: {
  },
  created() {
    this.recupFile();
    setInterval(function () { content.recupFile(); }, 5000);
  }
});
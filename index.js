let music;
let idmusic;
let sound;
let duration;
let timer;
let file = "";

function recupFile() {
  $.ajax({
    url: "https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/",
    context: document.body,
    headers: {
      "Authorization": "Basic " + btoa("rimet2u:070998.A")
    }
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
    url: 'https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/next',
    type: 'DELETE',
    headers: {
      "Authorization": "Basic " + btoa("rimet2u:070998.A")
    }
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
  xhr.setRequestHeader("Authorization", "Basic " + btoa("rimet2u:070998.A"));
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
}, 5000);
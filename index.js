let music;
let idmusic;
let sound;
function recupFile() {
  $.ajax({
    url: "https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/index.php",
    context: document.body,
    headers: {
      "Authorization": "Basic " + btoa("rimet2u:070998.A")
    }
  }).done(function (data) {
    console.log(data);
    let json = JSON.parse(data);
    if (json["pistes"][0] != null) {
      if (idmusic != json["pistes"][0]["idFile"]) {
        music = "";
        json["pistes"][0]["piste"]["artistes"].forEach(artiste => {
          music += artiste["nom"];
        });
        music += "-" + json["pistes"][0]["piste"]["nom"];
        idmusic = json["pistes"][0]["idFile"];
        playFirstMusic();
        $(".act").html(descPiste(json["pistes"][0]["piste"]));
      }
    }
    else $(".act").html("Musique Actuelle : Aucune");
  });
}

function nextMusic() {
  sound.unload();
  $.ajax({
    url: 'https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/next.php?' + $.param({ "id": idmusic }),
    type: 'DELETE',
    headers: {
      "Authorization": "Basic " + btoa("rimet2u:070998.A")
    }
  });
  recupFile();
}

function playFirstMusic() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('progress', function (e) {
    if (e.lengthComputable) {
      var percentComplete = (e.loaded / e.total) * 100;
      console.log('Status: Downloading music: ' + percentComplete + '%');
    }
  });

  xhr.addEventListener('load', function (blob) {
    if (xhr.status == 200) {
      sound = new Howl({
        src: [window.URL.createObjectURL(xhr.response)],
        format: ["mp3"]
      })
      sound.play();
      sound.on('end', function () {
        nextMusic();
      });
    }
  });

  xhr.open('GET', 'https://webetu.iutnc.univ-lorraine.fr/www/rimet2u/jukeinthebox/musique/' + music + '.mp3');
  xhr.setRequestHeader("Authorization", "Basic " + btoa("rimet2u:070998.A"));
  xhr.responseType = 'blob';
  xhr.send(null);
};

function descPiste(piste) {
  let desc="<h1>" + piste["nom"] + "</h1>";
  desc += "<p class='artiste'>Artistes : ";
  piste["artistes"].forEach(artiste => {
    desc += artiste["prénom"] +" "+ artiste["nom"]+" / "
  });
  desc += "<p class='genre'>Genre : ";
  piste["genres"].forEach(genre => {
    desc += genre + " / "
  });
  desc += "</p><img src='" + piste["image"] + "'><div class='albums'>ALBUMS";
  piste["albums"].forEach(album => {
    desc += "<p class='nom'>Album : " + album["nom"] + "</p> <p class='artiste'>Artistes : ";
    album["artistes"].forEach(artiste => {
      desc += artiste["nom"] + " " + artiste["prénom"] + " / ";
    });
    desc += "<p class='genre'> Genre : ";
    album["genres"].forEach(genre => {
      desc += genre + "/ ";
    });
    desc += "</p><img src='" + album["image"] + "'>"
  });
  desc += "</div>"
  return desc;
}

recupFile();

$(".next").click(function () {
  nextMusic();
});
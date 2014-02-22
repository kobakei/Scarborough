console.log("*** Getting playlist ***");

var attribute = "RADIOGENRE";

// 保存したUser IDを取得
var userId = localStorage["gracenote_user_id"];

var CLIENT_ID = "3868672-53AC3535785097C37E0B299756B825FB";
var FIELD_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/fieldvalues?fieldname=" + attribute + "&client=" + CLIENT_ID + "&user=" + userId;

var RETURN_COUNT = 5;
var RYTHM_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/create?client=" + CLIENT_ID + "&user=" + userId + "&return_count=" + RETURN_COUNT;

// Gracenoteを叩いて、Rythm APIフィールドリストを取得
function getFieldList() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", FIELD_ENDPOINT, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var text = xhr.responseText;
      console.log(text);
      var resp = JSON.parse(text);
      console.log(resp);
    }
  }
  xhr.send();
}

// ジャンル・ムード・時代でトラックリストを取得します
function getTrackListByRythm(genre, mood, era) {
  var url = RYTHM_ENDPOINT;
  if (genre) {
    url = url + "&genre=" + genre;
  }
  if (mood) {
    url = url + "&mood=" + mood;
  }
  if (era) {
    url = url + "&era=" + era;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var text = xhr.responseText;
      var resp = JSON.parse(text);
      console.log(resp);
    }
  }
  xhr.send();
}

// アーティスト名・アルバム名で取得
function getTrackListByWeb(artist, album) {
  var url = RYTHM_ENDPOINT;
  if (artist) {
    url = url + "&artist_name=" + artist;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var text = xhr.responseText;
      var resp = JSON.parse(text);
      console.log(resp);
    }
  }
  xhr.send();
}

getTrackListByRythm(36060, null, null);
//getTrackListByWeb("arctic monkeys");

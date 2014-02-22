console.log("*** Getting Gracenote User ID ***");

var CLIENT_ID = "3868672-53AC3535785097C37E0B299756B825FB";
var attribute = "RADIOGENRE";
var REGISTER_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/register?client=" + CLIENT_ID;
var FIELD_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/fieldvalues?fieldname=" + attribute + "&client=" + CLIENT_ID + "&user=" + userId;

var RETURN_COUNT = 5;
var RYTHM_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/create?client=" + CLIENT_ID + "&user=" + userId + "&return_count=" + RETURN_COUNT;
var WEB_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/album_search?mode=single_best&client=" + CLIENT_ID + "&user=" + userId + "&return_count=" + RETURN_COUNT;

// UserIDをストレージに保存する
function saveGracenoteUserId(user_id) {
  if (localStorage) {
    localStorage["gracenote_user_id"] = user_id;
  } else {
    console.log("ローカルストレージが使えません");
  }
}

// Gracenoteを叩く
function getUserId() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", REGISTER_ENDPOINT, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);
      console.log(resp);
      var userId = resp["RESPONSE"][0]["USER"][0]["VALUE"];
      console.log("User ID = " + userId);
      saveGracenoteUserId(userId);
    }
  }
  xhr.send();
}

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
function getTrackListByRythm(genre, mood, era, callback) {
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
      callback(resp);
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

// ユーザーが選択したタイプから、ジャンルとムードに変換する
function getGenreAndMoodFromType(type) {
  return {
    genre: 36060,
    mood: null
  };
}

// 以下、メインの処理
var userId = null;
if (localStorage["gracenote_user_id"]) {
  userId = localStorage["gracenote_user_id"];
  console.log("すでにUser IDが保存されています: " + localStorage["gracenote_user_id"]);
} else {
  getUserId();
}
// イベントハンドラの登録
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("onMessage");
    if (request.type) {
      var obj = getGenreAndMoodFromType(request.type);
      getTrackListByRythm(obj.genre, obj.mood, null, function(data){
        console.log("sendResponse");
        sendResponse({"hoge": "fuga"});
      });
    } else {
      console.log("sendResponse");
      sendResponse("error: type is null");
    }
  }
);
console.log("*** Getting Gracenote User ID ***");

var userId;

var CLIENT_ID = "3868672-53AC3535785097C37E0B299756B825FB";
var attribute = "RADIOGENRE";
var REGISTER_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/register?client=" + CLIENT_ID;
var FIELD_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/fieldvalues?fieldname=" + attribute + "&client=" + CLIENT_ID;

var RETURN_COUNT = 10;
var RYTHM_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/create?client=" + CLIENT_ID + "&return_count=" + RETURN_COUNT;
var WEB_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/album_search?mode=single_best&client=" + CLIENT_ID + "&return_count=" + RETURN_COUNT;

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
      userId = resp["RESPONSE"][0]["USER"][0]["VALUE"];
      console.log("User ID = " + userId);
      saveGracenoteUserId(userId);
    }
  }
  xhr.send();
}

// Gracenoteを叩いて、Rythm APIフィールドリストを取得
function getFieldList() {
  var xhr = new XMLHttpRequest();
  var url = FIELD_ENDPOINT + "&user=" + userId;
  xhr.open("GET", url, true);
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
  var url = RYTHM_ENDPOINT + "&user=" + userId;
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
      var obj = JSON.parse(text);
      console.log(obj);
      // いい感じに整形
      var resp = [];
      for (var i=0; i<obj['RESPONSE'][0]['ALBUM'].length; i++) {
        var album = obj['RESPONSE'][0]['ALBUM'][i];
        resp.push({
          artist: album['ARTIST'][0]['VALUE'],
          album: album['TITLE'][0]['VALUE'],
          track: album['TRACK'][0]['TITLE'][0]['VALUE']
        });
      }
      callback(resp);
    }
  }
  xhr.send();
}

// アーティスト名・アルバム名で取得
function getTrackListByWeb(artist, album) {
  var url = RYTHM_ENDPOINT + "&user=" + userId;
  if (artist) {
    url = url + "&artist_name=" + artist;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var text = xhr.responseText;
      var obj = JSON.parse(text);
      console.log(obj);
      // いい感じに整形
      var resp = [];
      for (var i=0; i<obj.length; i++) {
        resp.push({
          artist: "",
          album: "",
          track: ""
        });
      }
      console.log(resp);
    }
  }
  xhr.send();
}

// ユーザーが選択したタイプから、ジャンルとムードに変換する
function getGenreAndMoodFromType(cardId) {
  return CARD_LIST[cardId];
}

// トラック名などから、Spotify上のトラックIDを取得します
function getSpotifyTrackId(album, artist, track, callback) {
  // TODO
}

//
function getSpotifyTrackIdList(data, callback) {
  var count = RETURN_COUNT;
  var trackIdList = [];
  for (var i=0; i<data.length; i++) {
    getSpotifyTrackId(data[i].album, data[i].artist, data[i].track, function(trackId){
      trackIdList.push(trackId);
      count--;
      if (count <= 0) {
        callback(trackIdList);
      }
    });
  }
}

// 以下、メインの処理

// UserID取得
getUserId();

// イベントハンドラの登録
console.log("*** Adding event handler ***");
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("onMessage");
    //console.log(sendResponse);
    if (request.type) {
      var obj = getGenreAndMoodFromType(request.type);
      if (obj) {
        getTrackListByRythm(obj.genre, obj.mood, null, function(data){
          console.log(data);

          // TODO Spotify IDに変換

          sendResponse({
            ids: [
              "4bi73jCM02fMpkI11Lqmfe",
              "4bi73jCM02fMpkI11Lqmfe",
              "4bi73jCM02fMpkI11Lqmfe"
            ]
          });
          //console.log(chrome.runtime.lastError.message);
          console.log("sendResponse success");
        });
      } else {
        sendResponse({});
        console.log("sendResponse failure2");
      }
    } else {
      sendResponse({});
      console.log("sendResponse failure1");
    }
    return true;
  }
);
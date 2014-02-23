console.log("*** Getting Gracenote User ID ***");

var userId;

var CLIENT_ID = "3868672-53AC3535785097C37E0B299756B825FB";
var attribute = "RADIOERA";
var REGISTER_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/register?client=" + CLIENT_ID;
var FIELD_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/fieldvalues?fieldname=" + attribute + "&client=" + CLIENT_ID;

var RETURN_COUNT = 25;
var RYTHM_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/create?client=" + CLIENT_ID + "&return_count=" + RETURN_COUNT;
var WEB_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/album_search?mode=single_best&client=" + CLIENT_ID + "&return_count=" + RETURN_COUNT;
var getDomainExpr = /^[httpsfile]+:\/{2,3}([0-9a-zA-Z\.\-:]+?):?[0-9]*?\//i;
var associative_rule = [];
var rule_group = [];

associative_rule[0] = [];
associative_rule[0].expr = /.*[sS]potify.*/;
associative_rule[0].jenre = "25964";
associative_rule[0].jenre_description = "Rock";
associative_rule[0].mood = "65332";
associative_rule[0].mood_description = "Lively";
associative_rule[0].ere = "";
associative_rule[1] = [];
associative_rule[1].expr = /.*github\.com.*/;
associative_rule[1].situation = "business";
associative_rule[2] = [];
associative_rule[2].expr = /.*www\.2ch\.net.*/;
associative_rule[2].situation = "play";
associative_rule[3] = [];
associative_rule[3].expr = /.*livedoor.*/;
associative_rule[3].situation = "play";

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

      //test
      //getFieldList();
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
  console.log("getTrackListByRythm");
  var url = RYTHM_ENDPOINT + "&user=" + userId;
  if (genre && genre.length > 0) {
    url = url + "&genre=" + genre;
  }
  if (mood && mood.length > 0) {
    url = url + "&mood=" + mood;
  }
  if (era && era.length > 0) {
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
      if (obj['RESPONSE'][0]['ALBUM']) {
        for (var i=0; i<obj['RESPONSE'][0]['ALBUM'].length; i++) {
          var album = obj['RESPONSE'][0]['ALBUM'][i];
          resp.push({
            artist: album['ARTIST'][0]['VALUE'],
            album: album['TITLE'][0]['VALUE'],
            track: album['TRACK'][0]['TITLE'][0]['VALUE']
          });
        }
      }
      callback(resp);
    }
  }
  xhr.send();
  return true;
}

// アーティスト名・アルバム名で取得
/*
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
}*/

// ユーザーが選択したタイプから、ジャンルとムードに変換する
function getGenreAndMoodFromType(cardId) {
  obj = CARD_LIST[cardId];

  // Card ID = 5のときは、ローカルストレージに保存した設定（タブから決まったもの）を使う
  if (cardId == 5) {
    if (localStorage["mood"]) {
      obj.mood = localStorage["mood"];
      obj.jenre = localStorage["jenre"];
      obj.ere = localStorage["ere"];
    }
  }
  return obj;
}

// 必要な数だけSpotify Track IDの配列を取得します
function getSpotifyTrackIdList(data, callback) {
  console.log("getSpotifyTrackIdList");
  var count = RETURN_COUNT;
  var trackIdList = [];
  for (var i=0; i<data.length; i++) {
    getTrackID(data[i].track, data[i].album, data[i].artist, function(trackId){
      if (trackId) {
        console.log("Spotify Track ID: " + trackId);
        trackIdList.push(trackId);
      } else {
        console.log("Spotifyで見つかりませんでした");
      }
      count--;
      if (count <= 0) {
        console.log("コールバック受け取り完了");
        console.log(trackIdList);
        callback(trackIdList);
      }
    });
  }
  return true;
}

var notification = null;

// 通知を表示する
function showNotification(title, body) {
  if (notification) {
    notification.cancel();
  }
  notification = webkitNotifications.createNotification(
    'icon128.png', //'48.png',  // icon url - can be relative
    title,  // notification title
    body  // notification body text
    );
  notification.show();

  // 1minで自動で消す
  chrome.alarms.onAlarm.addListener(function(alarm){
    console.log("Alarm:" + alarm.name);
    if (notification) {
      notification.cancel();
      notification = null;
    }
  });
  chrome.alarms.create("delete_notification", {
    delayInMinutes: 0.15
  });
}

function getGenreName(id) {
  if (id == "") {
    return "";
  }
  for (var i=0; i<GENRE_LIST.length; i++) {
    if (GENRE_LIST[i]['ID'] == id) {
      return GENRE_LIST[i]['VALUE'];
    }
  }
  return "";
}

function getMoodName(id) {
  if (id == "") {
    return "";
  }
  for (var i=0; i<MOOD_LIST.length; i++) {
    if (MOOD_LIST[i]['ID'] == id) {
      return MOOD_LIST[i]['VALUE'];
    }
  }
  return "";
}

// シチュエーションからムード等を設定する
function convertParams(situation) {
  if (situation == "business") {
    // 仕事
    localStorage["mood"]　= localStorage["mood1"];
    localStorage["jenre"]　= localStorage["genre1"];
    localStorage["ere"]　= localStorage["era1"];
  } else if (situation == "play") {
    // 遊び
    localStorage["mood"] = localStorage["mood2"];
    localStorage["jenre"] = localStorage["genre2"];
    localStorage["ere"] = localStorage["era2"];
  } else {
    // その他
    localStorage["mood"]　= localStorage["mood3"];
    localStorage["jenre"]　= localStorage["genre3"];
    localStorage["ere"]　= localStorage["era3"];
  }
}

// タイトルからムード等を設定する
function saveParamsByTitle(title, url) {
  var prevMood = localStorage["mood"];
  var prevGenre = localStorage["jenre"];
  var prevEra = localStorage["ere"];
  var domain = url.match(getDomainExpr)[1];

  for (i = 0; i < associative_rule.length; i=i+1) {
    expr = associative_rule[i].expr;
    if (expr.test(domain)) {
      if (associative_rule[i].situation) {
        convertParams(associative_rule[i].situation);
        
      } else if (associative_rule[i].mood) {
        // シチュエーションが無く、直接パラメータが設定されている場合
        localStorage["mood"] = associative_rule[i].mood;
        localStorage["jenre"] = associative_rule[i].jenre;
        localStorage["ere"] = associative_rule[i].ere;

        console.log("mood: " + associative_rule[i].mood_description);
        console.log("jenre: " + associative_rule[i].jenre_description);
        console.log("ere: " + associative_rule[i].ere);
      } else {
        continue;
      }
      break;
    }
  }
  localStorage["tab_title"] = title;
  localStorage["tab_url"] = url;

  // 新しい設定になったら、通知を出す
  if (prevMood != localStorage["mood"] ||
    prevGenre != localStorage["jenre"] ||
    prevEra != localStorage["ere"]) {

    moodName = getMoodName(localStorage["mood"]);
    jenreName = getGenreName(localStorage["jenre"]);

    if (moodName != "" && jenreName != "") {
      showNotification('Scarborough', '今のあなたには ' + moodName + " な " + jenreName + " がおすすめ♪");
    } else if (moodName != "") {
      showNotification('Scarborough', '今のあなたには ' + moodName + " な曲がおすすめ♪");
    } else if (jenreName != "") {
      showNotification('Scarborough', '今のあなたには ' + jenreName + " がおすすめ♪");
    }
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
          console.log("Success to get track list by GN");
          console.log(data);
          // Spotify IDに変換
          getSpotifyTrackIdList(data, function(trackIds){
            sendResponse({
              ids: trackIds
            });
            //console.log(chrome.runtime.lastError.message);
            console.log("sendResponse success");
          });
          return true;
        });
        return true;
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

chrome.tabs.onUpdated.addListener(function(tab_id, actInfo, tab) {
  console.log("tab update");
  // 取得不要時
  if (actInfo.status == "loading") {
    return;
  }
  if (tab) {
    saveParamsByTitle(tab.title, tab.url);
  }
});

chrome.tabs.onActivated.addListener(function(actInfo) {
  console.log("*** tab activated ***");
  chrome.tabs.get(actInfo.tabId, function(tab) {
    saveParamsByTitle(tab.title, tab.url);
  });
});

// 初期設定
// Business
if (!localStorage["mood1"]) {
  localStorage["mood1"] = "42955";
  localStorage["genre1"] = "36055";
  localStorage["era1"] = "";
}
// Relax
if (!localStorage["mood2"]) {
  localStorage["mood2"] = "";
  localStorage["genre2"] = "36063";
  localStorage["era2"] = "";
}
// Other
if (!localStorage["mood3"]) {
  localStorage["mood3"] = "";
  localStorage["genre3"] = "36056";
  localStorage["era3"] = "";
}

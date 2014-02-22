console.log("*** Getting Gracenote User ID ***");

var userId;

var CLIENT_ID = "3868672-53AC3535785097C37E0B299756B825FB";
var attribute = "RADIOGENRE";
var REGISTER_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/register?client=" + CLIENT_ID;
var FIELD_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/fieldvalues?fieldname=" + attribute + "&client=" + CLIENT_ID;

var RETURN_COUNT = 25;
var RYTHM_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/radio/create?client=" + CLIENT_ID + "&return_count=" + RETURN_COUNT;
var WEB_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/album_search?mode=single_best&client=" + CLIENT_ID + "&return_count=" + RETURN_COUNT;
var associative_rule = [];

associative_rule[0] = []
associative_rule[0].expr = /.*[sS]potify.*/;
associative_rule[0].jenre = "25964";
associative_rule[0].jenre_description = "Rock";
associative_rule[0].mood = "65332";
associative_rule[0].mood_description = "Lively";
associative_rule[0].ere = "";


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
  obj = CARD_LIST[cardId];
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
}

// 通知を表示する
function showNotification(title, body) {
  var notification = webkitNotifications.createNotification(
    'icon128.png', //'48.png',  // icon url - can be relative
    title,  // notification title
    body  // notification body text
  );
  notification.show();

  // 1minで自動で消す
  chrome.alarms.onAlarm.addListener(function(alarm){
    console.log("Alarm:" + alarm.name);
    notification.cancel();
  });
  chrome.alarms.create("delete_notification", {
    delayInMinutes: 0.15
  });
}

// タイトルからムード等を設定する
function saveParamsByTitle(title) {
  //console.log("save params by title");
  var prevMood = localStorage["mood"];
  var prevGenre = localStorage["jenre"];
  var prevEra = localStorage["ere"];
  //console.log("prev mood: " + prevMood);
  //console.log("prev jenre: " + prevGenre);

  for (i = 0; i < associative_rule.length; i=i+1) {
    expr = associative_rule[i].expr;
    if (expr.test(title)) {
      localStorage["mood"] = associative_rule[i].mood;
      localStorage["jenre"] = associative_rule[i].jenre;
      localStorage["ere"] = associative_rule[i].ere;

      console.log("mood: " + associative_rule[i].mood_description);
      console.log("jenre: " + associative_rule[i].jenre_description);
      console.log("ere: " + associative_rule[i].ere);
      break;
    }
  }

  // 新しい設定になったら、通知を出す
  if (prevMood != localStorage["mood"] ||
    prevGenre !=localStorage["jenre"] ||
    prevEra != localStorage["ere"]) {
    showNotification('Scarborough',
      '今のあなたには' + localStorage["moode"] + " " + localStorage["jenre"] + "がおすすめ♪");
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
  // 取得不要時
  if (actInfo.status == "loading") {
    return;
  }
  if (tab) {
    saveParamsByTitle(tab.title);
    localStorage["tab_title"] = tab.title;

  }
});

chrome.tabs.onActivated.addListener(function(actInfo) {
  chrome.tabs.get(actInfo.tabId, function(tab) {
    saveParamsByTitle(tab.title);
    localStorage["tab_title"] = tab.title;
  });
});

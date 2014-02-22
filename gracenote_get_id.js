console.log("*** Getting Gracenote User ID ***");

var CLIENT_ID = "3868672-53AC3535785097C37E0B299756B825FB";
var REGISTER_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/register?client=" + CLIENT_ID;

// UserIDをストレージに保存する
function saveGracenoteUserId(user_id) {
  if (localStorage) {
    localStorage["gracenote_user_id"] = user_id;
  } else {
    console.log("ローカルストレージが使えません");
  }
}

// Gracenoteを叩く
function sendRequest() {
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

if (localStorage["gracenote_user_id"]) {
  console.log("すでにUser IDが保存されています: " + localStorage["gracenote_user_id"]);
} else {
  sendRequest();
}
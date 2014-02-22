console.log("Hello bg.js");

var CLIENT_ID = "3868672-53AC3535785097C37E0B299756B825FB";
var REGISTER_ENDPOINT = "https://c3868672.web.cddbp.net/webapi/json/1.0/register?client=" + CLIENT_ID;

// Gracenoteを叩く
/*
$.get(REGISTER_ENDPOINT, function(data){
  console.log("*** response ***");
  console.log(data);
});
*/

var xhr = new XMLHttpRequest();
xhr.open("GET", REGISTER_ENDPOINT, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // JSON.parse does not evaluate the attacker's scripts.
    var resp = JSON.parse(xhr.responseText);
    console.log(resp);
  }
}
xhr.send();

console.log("Completed!");
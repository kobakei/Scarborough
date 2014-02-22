var SPOTIFY_ENDPOINT = "http://ws.spotify.com/search/1/track.json?q=";

var TRACK = 0;
var ALBUM = 1;
var ARTIST = 2;
var CALLBACK = 3;

//===============================
// Public
//===============================
function getTrackID(a_track_name, a_album, a_artist, a_callback){
	var l_track_info;
	l_track_info = [a_track_name, a_album, a_artist, a_callback];

	prv_getTrackID(l_track_info);
}


//===============================
// Private
//===============================
function prv_getTrackID(a_track_info){
	var xhr = new XMLHttpRequest();
	var str = new String();

	str += SPOTIFY_ENDPOINT;
	str += a_track_info[TRACK];

	console.log(str);

	xhr.open("GET", str, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			// JSON.parse does not evaluate the attacker's scripts.
			var resp = JSON.parse(xhr.responseText);
			console.log(resp);

			//Get artist's name
			var i=0;
			var l_album, l_artist, l_track_id;
			l_track_id = null;

			while(i<resp.tracks.length){
				l_artist = resp.tracks[i].artists[0].name.toLowerCase();
				l_album = resp.tracks[i].album.name.toLowerCase();
				l_artist2 = a_track_info[ARTIST].toLowerCase();
				l_album2 = a_track_info[ALBUM].toLowerCase();
				
				if(l_artist == l_artist2 && l_album == l_album2){
					l_track_id = resp.tracks[i].href.replace("spotify:track:", "");
//					l_track_id = resp.tracks[i]['external-ids'][0].id;
					console.log(l_track_id);
					break;
				}
				i++;
			}

			//Notify track-id
			a_track_info[CALLBACK](l_track_id);
		}
	}
	xhr.send();
}

//===============================
// Debug
//===============================
function test(){
	console.log("[spotify_get_id] test");

	var testCallback = function(track){console.log(track);}
	getTrackID("Tea for Two", "Summer Jazz", "Art Tatum", testCallback);
}

var REGISTER_ENDPOINT = "http://ws.spotify.com/search/1/track.json?q=";

var TRACK = 0;
var ALBUM = 1;
var ARTIST = 2;
var CALLBACK = 3;

var m_track_info;

//===============================
// Public
//===============================
function getTrackID(a_track_name, a_album, a_artist, a_callback){
	m_track_info = [a_track_name, a_album, a_artist, a_callback];
	
	prv_getTrackID(m_track_info[TRACK]);
}


//===============================
// Private
//===============================
function prv_getTrackID(a_track_name){
	var xhr = new XMLHttpRequest();
	var str = new String();

	str += REGISTER_ENDPOINT;
	str += a_track_name;
	
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
				l_artist = resp.tracks[i].artists[0].name;
				l_album = resp.tracks[i].album.name;
				if(l_artist == m_track_info[ARTIST] && l_album == m_track_info[ALBUM]){
					l_track_id = resp.tracks[i]['external-ids'][0].id;
					console.log(l_track_id);
					break;
				}
				i++;
			}
			
			//Notify track-id
			m_track_info[CALLBACK](l_track_id);
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
	getTrackID("Tea for Two", "Summer Jazz", "Art atum", testCallback);
}

(function($) {
	$(document).ready(function(){
		setup();
		restore_options();
	});

	function setup() {
		console.log("Setup...");
		for (var i=0; i<GENRE_LIST.length; i++) {
			var g = GENRE_LIST[i];
			$("#genre1").append('<option value="' + g['ID'] + '">'+ g['VALUE'] +'</option>');
			$("#genre2").append('<option value="' + g['ID'] + '">'+ g['VALUE'] +'</option>');
			$("#genre3").append('<option value="' + g['ID'] + '">'+ g['VALUE'] +'</option>');
		}

		for (var i=0; i<MOOD_LIST.length; i++) {
			var g = MOOD_LIST[i];
			$("#mood1").append('<option value="' + g['ID'] + '">'+ g['VALUE'] +'</option>');
			$("#mood2").append('<option value="' + g['ID'] + '">'+ g['VALUE'] +'</option>');
			$("#mood3").append('<option value="' + g['ID'] + '">'+ g['VALUE'] +'</option>');
		}

		$("#save").click(function(e){
			save_options();
		});
	}

	// Save options to localStorage
	function save_options() {
		console.log("save options...");
		var ids = [
			"genre1", "genre2", "genre3",
			"mood1", "mood2", "mood3"
		];
		for (var i=0; i<ids.length; i++) {
			var select1 = document.getElementById(ids[i]);
			var genre1 = select1.children[select1.selectedIndex].value;
			localStorage[ids[i]] = genre1;
			console.log("id=" + ids[i] + ", value=" + genre1);
		}
		alert("Options saved.");
	}

	// Restores select box state to saved value from localStorage
	function restore_options() {
		console.log("restore options...");
		var ids = [
			"genre1", "genre2", "genre3",
			"mood1", "mood2", "mood3"
		];
		for (var j=0; j<ids.length; j++) {
			var select1 = document.getElementById(ids[j]);
			var genre1 = localStorage[ids[j]];
			for (var i = 0; i < select1.children.length; i++) {
				var child = select1.children[i];
				if (child.value == genre1) {
					child.selected = "true";
				}
			}
		}
	}
})(jQuery);
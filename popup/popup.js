(function($) {
	$(document).ready(function() {
		eventAdd();
	});

	function eventAdd() {
		$(document).on('click', '.card', function(e) {
			makelist();
		});

		$(document).on('click', '#back', function(e) {
			back();
		});

	}

	function makelist() {

		$('#list').slideUp();
		$('#playlist').show();

		//このURLをAPIでかえす
		var url = 'https://embed.spotify.com/?uri=spotify:user:erebore:playlist:788MOXyTfcUb1tdw4oC7KJ';
		$('<iframe />').attr('src', url).attr('frameborder', '0').attr('allowtransparency', 'true').attr('width', '300').attr('height', '380').appendTo('#playlist');
	};

	function back() {
		$('#playlist').hide().find('iframe').remove();
		$('#list').show();
	}

})(jQuery);

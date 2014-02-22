(function($) {
	$(document).ready(function() {
		eventAdd();
		setcardimg();
	});
	
	function eventAdd() {
		$(document).on('click', '.card', function(e) {
			makelist();
		});

		$(document).on('click', '#back', function(e) {
			back();
		});

	}
	
	function setcardimg() {
		$('.card').each(function() {
			$(this).css('background-image','url(http://31.media.tumblr.com/78ce1831f575f06a6ca966ee2c9198f1/tumblr_n10nb0TY4u1st5lhmo1_1280.jpg)');
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

	function kickapi() {
		// 第一引数に選択されたモード、第二引数がコールバック
		chrome.runtime.sendMessage({
			type : "hoge"
		}, function(response) {
			// responseはSpotifyIDのリスト
			// ['AAAAA', 'BBBBBB', 'CCCCCC'] みたいな形式
			alert(response);
		});
	}

})(jQuery);

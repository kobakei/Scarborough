(function($) {
	$(document).ready(function() {
		eventAdd();
		isPlaylist();
		getcardlist();
	});

	function eventAdd() {
		$(document).on('click', '.card', function(e) {
			makelist(this);
		});

		$(document).on('click', '#back', function(e) {
			back();
		});
	}
	
	function isPlaylist() {
		if (localStorage["present_playlist"]) {
			$('#list').hide();
			var url = 'https://embed.spotify.com/?uri=spotify:trackset:' + localStorage["present_playlist"];
			$('<iframe />').attr('src', url).attr('frameborder', '0').attr('allowtransparency', 'true').attr('width', '300').attr('height', '380').appendTo('#playlist');
			$('#playlist').show();
		}
	}
	
	function getcardlist() {
		$('#list').append('<li data-id="'+ 5 +'" class="card">'+ localStorage["tab_title"] +'をみているあなたへのおすすめ</li>');
		$('#list li:last').css('background-image', 'url(http://25.media.tumblr.com/3f62ba4c56724f227dba2b4415a61049/tumblr_myebqysYZ81st5lhmo1_1280.jpg)');
		var title = ['1','2', '3', '4'];
		for (var i=1 ; i<=title.length ; i++){
			$('#list').append('<li data-id="'+ CARD_LIST[i].id +'" class="card">'+ CARD_LIST[i].message +'</li>');
			$('#list li:last').css('background-image', 'url(' + CARD_LIST[i].img + ')');
		}
		//setcardimg();
	}

	function setcardimg() {

		var imgList = ["http://25.media.tumblr.com/8fb80a2a6111ffbf05defc3a758a2f8a/tumblr_n10n4rpjvZ1st5lhmo1_1280.jpg", "http://31.media.tumblr.com/78ce1831f575f06a6ca966ee2c9198f1/tumblr_n10nb0TY4u1st5lhmo1_1280.jpg", "http://25.media.tumblr.com/d4955c5fb31743bd0740f5001adafb79/tumblr_n10n3wfcrl1st5lhmo1_1280.jpg", "http://25.media.tumblr.com/18e25cdcdaaced3b2b8a467724720ece/tumblr_n10n1wmxiS1st5lhmo1_1280.jpg"];

		var img = "http://25.media.tumblr.com/3f62ba4c56724f227dba2b4415a61049/tumblr_myebqysYZ81st5lhmo1_1280.jpg";

		$('.card').each(function(i) {
			var num = Math.floor(Math.random() * 4);
			$(this).css('background-image', 'url(' + imgList[num] + ')');
			//$(this).css('background-image','url(' + img +')');
		});
	}

	function makelist(that) {
		kickapi(that);
		$('#list').slideUp('slow');
	};

	function back() {
		$('#playlist').hide().find('iframe').remove();
		$('#list').show();
	}

	function kickapi(that) {
		var $this = $(that);
		// 第一引数に選択されたモード、第二引数がコールバック
		chrome.runtime.sendMessage({
			type : $this.attr('data-id')
		}, function(response) {
			console.log(response);
			var list = response.ids.join(',');
			localStorage["present_playlist"] = list;
			//このURLをAPIでかえす
			var url = 'https://embed.spotify.com/?uri=spotify:trackset:' + list;
			$('<iframe />').attr('src', url).attr('frameborder', '0').attr('allowtransparency', 'true').attr('width', '300').attr('height', '380').appendTo('#playlist');
			$('#playlist').show();
		});
	}

})(jQuery);

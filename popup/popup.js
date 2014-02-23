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
		
		$(document).on('click', '#scarb', function(e) {
			scarborough();
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
		var title = ['5', '1', '2', '3', '4'];
		//DEF list
		title.unshift(getTime());

		getWeather();
		title.push('20');
		title.push('30');

		for (var i = 0; i <= title.length; i++) {
			if (!title[i]) break; //おまじない
			if (title[i] == 5) {
				$('#list').append('<li data-id="' + 5 + '" class="card">' + localStorage["tab_title"] + 'をみているあなたへのおすすめ</li>');
			} else {
				$('#list').append('<li data-id="' + CARD_LIST[title[i]].id + '" class="card ' + CARD_LIST[title[i]].addclass + '">' + CARD_LIST[title[i]].message + '</li>');
			}
			$('#list li:last').css('background-image', 'url(' + CARD_LIST[title[i]].img + ')');
		}
	}
	
	function scarborough() {
		$('#list').slideUp();
		$('#playlist').show().append('<iframe src="https://embed.spotify.com/?uri=spotify:track:59Jeyi4xmH9nt2tmKPh5Bt" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
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
			
			if (response.ids.length == 0) {
				$('#playlist').show();
				return;
			}
			
			var list = response.ids.join(',');
			localStorage["present_playlist"] = list;
			//このURLをAPIでかえす
			var url = 'https://embed.spotify.com/?uri=spotify:trackset:' + list;
			$('<iframe />').attr('src', url).attr('frameborder', '0').attr('allowtransparency', 'true').attr('width', '300').attr('height', '380').appendTo('#playlist');
			$('#playlist').show();
		});
	}

	function getTime() {
		var date = new Date(), h = date.getHours();
		var nn = ["10", "11", "12", "12", "13", "14"];
		return nn[Math.ceil(h / 4) - 1];
	};

	function getWeather() {
		
		//うまくいかない
		return;
		
		escapeTag = function(string) {
			if (string == null)
				return string;
			return string.replace(/[&<>"']/g, function(match) {
				return {
				'&' : '&amp;',
				'<' : '&lt;',
				'>' : '&gt;',
				'"' : '&quot;',
				"'" : '#&39;'
				}[match];
			});
		};

		var city = '130010';
		// Tokyo
		var wetherURL = 'http://weather.livedoor.com/forecast/webservice/json/v1?city=' + city;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", wetherURL, true);
		//xhr.open("GET", 'http://pipes.yahoo.com/pipes/pipe.run?u=' + encodeURI(wetherURL) + '&_id=332d9216d8910ba39e6c2577fd321a6a&_render=json&_callback=?', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				console.log(xhr.responseText);
				var item = JSON.parse(xhr.responseText);
				console.log(item);
				item = item.value.items[0];
				console.log(item);
				$('<div><b>' + escapeTag(item.location.city) + escapeTag(item.forecasts[0].dateLabel) + '</b><img src=' + escapeTag(item.forecasts[0].image.url) + '>' + ' <small>' + escapeTag(item.forecasts[0].telop) + '</small><small>copyright livedoor 天気情報</small>' + '</div>').appendTo('#main');
			}
		};
		xhr.send();
	}

})(jQuery);

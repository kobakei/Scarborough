(function($) {
	$(document).ready(function() {
		autoPlay();
	});

	function autoPlay() {
		$('#spotify').load(function() {
			setTimeout(function(){
				play();
			}, 1000);

			function play() {
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('click', // type
				true, // bubbles
				true, // cancelable
				window, // view
				0, // detail（クリック数）
				50, // screenX（デバイス全体における座標）
				50, // screenY
				0, // clientX（ブラウザ表示域における座標）
				0, // clientY
				false, // ctrlKey
				false, // altKey
				false, // shiftKey
				false, // metaKey
				0, // button（0 が左、1 が中、2 が右クリック）
				null // relatedTarget
				);
				var n = document.getElementById("spotify");
				// クリックのターゲットにしたいノード
				n.dispatchEvent(e);
			}

		});
	};

})(jQuery);

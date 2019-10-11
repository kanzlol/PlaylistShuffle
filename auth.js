

		//authentication
	function onGoogleLoad() {
	    gapi.client.setApiKey('AIzaSyDm863fpRs8pymCcK1n1u3qymea59UFld0');
	    gapi.client.load('youtube', 'v3', function() {
	        //stuff
	    });
	}
		//loads iframe api on load
	function loadScript() {
	    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
	        var tag = document.createElement('script');
	        tag.src = "https://www.youtube.com/iframe_api";
	        var firstScriptTag = document.getElementsByTagName('script')[0];
	        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	    }
	}

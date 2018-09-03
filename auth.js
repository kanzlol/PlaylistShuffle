


	function onGoogleLoad() {
	    gapi.client.setApiKey('AIzaSyB3Sim7dGZnujr7gkJ64UR6VZLFeyx1YSg');
	    gapi.client.load('youtube', 'v3', function() {
	        //stuff
	    });
	}

	function loadScript() {
	    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
	        var tag = document.createElement('script');
	        tag.src = "https://www.youtube.com/iframe_api";
	        var firstScriptTag = document.getElementsByTagName('script')[0];
	        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	    }
	}
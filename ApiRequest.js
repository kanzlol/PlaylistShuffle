

    //variables
    var playlistId, nextPageToken, prevPageToken, player, showPlaylist;
    var vidIds = [];
    var vidTitle = [];

    //runs on submit
    $(function() {
        $('form').on('submit', function(event) {

            event.preventDefault();
            var url = $('#search').val();
            var formatUrl = youtubeValidate(url);
            if(formatUrl) {
                //variables for ajax call
                var convertedUrl = youtubeConvert(url);
                var request = gapi.client.youtube.playlistItems.list({
                    part: 'snippet',
                    playlistId: convertedUrl,
                    maxResults: 1,
                });
                //executes ajax call -> runs it if it succeeds
                request.execute(function(response) {
                    //displaying the load of playlist when first request has been made, letting the user know it's running
                    for(let i = 1; i <= 10; i++) {
                        setTimeout(function timer() {
                            $('#loading').append('<ul><li><a href="#">Loading Playlist....</a></li></ul>');                           
                        }, i * 500);
                    }
                    playlistId = convertedUrl;
                    $('#searchForm').hide();
                    $("#results").html("");
                    console.log(response.result);
                    requestPlaylist(playlistId, response.nextPageToken);                
                });
            }
        });
    }); 

    //taking playlistId and pageToken
    function requestPlaylist(playlistId, pageToken) {
        //variables for ajax call
        var requestOptions = {
            playlistId: playlistId,
            part: 'snippet',
            maxResults: 50
        };
        //requesting first page token
        if (pageToken) {
            requestOptions.pageToken = pageToken;
        }

        var request = gapi.client.youtube.playlistItems.list(requestOptions);
        //executes ajax call
        request.execute(function(response) {
            nextPageToken = response.nextPageToken;

            
            var playlistItems = response.result.items;

            if (playlistItems) {
                //pushing title responses into array
                $.each(playlistItems, function(index, item) {
                    vidTitle.push(item.snippet.title);
                });
            } 
            else {
                $('#results').html('Sorry. There is no uploaded videos.');
            }
            //requesting next page token
            if (pageToken) {
                nextPageToken = response.nextPageToken;
                //pushing id's from next page token, if any
                if(nextPageToken) {
                    $.each(playlistItems, function(index, item) {
                        vidIds.push(item.snippet.resourceId.videoId);
                    });
                    //return function until there's no more next page tokens
                    return requestPlaylist(playlistId, nextPageToken);
                }
                else {
                    //calling iframe api load function if it doesn't already exist
                    if(!$('script').attr('src=iframe_api')) {
                        loadScript();
                        $('#next-button').show();
                        shuffle(vidIds, vidTitle);
                        displayPlaylist(vidTitle)

                        return;
                    }
                }
                //loads video id array into youtube player
                loadPlayer(vidIds);
            }
            //if it fails, try again
            else {
                nextPageToken = response.nextPageToken;

                if(nextPageToken) {
                    $.each(playlistItems, function(index, item) {
                        vidIds.push(item.snippet.resourceId.videoId);
                    });
                    newPageToken = nextPageToken;
                    return requestPlaylist(playlistId, newPageToken);
                }
                else {
                    return requestPlaylist(playlistId, newPageToken);
                }
            }
        });
    }

    //displaying playlist below youtube player
    function displayPlaylist(vidTitle) {
        $('#playlist').append('<ul><li><a href="#">' + vidTitle[0] + '</a></li></ul>').show();

        $.each(vidTitle, function(index) {
        var showPlaylist = nextItem(vidTitle);
            $('#playlist').append('<ul><li><a href="#">' + showPlaylist + '</a></li></ul>').show();
        });
    }

    //displaying current video title and next video title
    function displayTitle() {
        var b = nextTitle(vidTitle);
        document.title = b;
        $('#titles').html('<h2>' + b + '</h2><h3>Next: ' + nextOfNext(vidTitle) + '</h3>');
        $('#remaining').html('(remaining: ' + vidTitle[i].length + ')');
    }

    //plays next video on click function
    function nextSong() {
        $('#prev-button').show();
        displayTitle();

        //loads next item in array
        var next = nextItem(vidIds);
        player.loadVideoById(next);
    }

    //plays previous video on click function
    function previousSong() {
        var prevT = prevTitle(vidTitle);
        document.title = prevT;
        $('#titles').html('<h2>' + prevT + '</h2><h3>Next: ' + prevOfNext(vidTitle) + '</h3>');
        $('#remaining').html('(remaining: ' + vidTitle.length + ')');

        //loads previous item in array
        var prev = prevItem(vidIds);
        player.loadVideoById(prev);

        //hides previous button if you're at the beginning of index
        if(prev === vidIds[0]) {
            $('#prev-button').hide();
        }
    }

    //listening to when the state is changing on the player
    function onChange(event) {
        var currentId = vidIds[i];

        //runs when video ends
        if(event.data === 0) {
            if(document.getElementById('loop').checked) {
                player.loadVideoById(currentId);
                player.seekTo(0);
            }
            else {
                $('#prev-button').show();
                displayTitle();
                play();
            }

        }
    }

    //loads after the player is ready
     function onPlayerReady() {
        document.title = vidTitle[0];
        $('#remaining').html('(remaining: ' + vidTitle.length + ')');
        $('#titles').html('<h2>' + vidTitle[0] + '</h2><h3>Next: ' + nextOfNext(vidTitle) + '</h3>');
        $('#results').after('<br><hr class="underline"><br>');
        player.loadVideoById(vidIds[0]);
        
    }

    //handles the video ID and plays it
    function play(id) {
        var next = nextItem(vidIds);
        player.loadVideoById(next);
    }

    //loading youtube when it's ready
    function onYouTubeIframeAPIReady() {
        $('#loading').remove(); 
        $('#functionality').show();
        //variables for youtube iframe
        player = new YT.Player( 'results', {
            width: '640',
            height: '360',
            playerVars: { 
                'autoplay': 0,
                'controls': 1,
                'showinfo': 0,
                'cc_load_policy': 0,
                'iv_load_policy': 3
            },
            events: { 
                'onReady': onPlayerReady,
                'onStateChange': onChange
            }
        });
    }

    function loadPlayer() {
        window.onYouTubePlayerAPIReady = function() {
            onYouTubeIframeAPIReady();
        };
    }

    //validating youtube link
    function youtubeValidate(url) {
        var regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if(match) {
            return match[1];
        }
        else {
            alert("Insert a Playlist");
        }

    }

    //converting youtube link into playlist ID
    function youtubeConvert(url) {
        var regExp = /[&?]list=([^&]+)/i;
        var match = url.match(regExp);
        if (match) {
            return match[1];
        }
        else {

        }
    }
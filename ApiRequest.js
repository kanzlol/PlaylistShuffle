


    var playlistId, nextPageToken, prevPageToken, player, showPlaylist, abc;
    var i = 0;
    var j = 0;
    var l = 0;
    var a = 0;
    var vidIds = [];
    var vidTitle = [];

    $(function() {
        $('form').on('submit', function(event) {

            event.preventDefault();
            var url = $('#search').val();
            var formatUrl = youtubeValidate(url);
            if(formatUrl) {
                var convertedUrl = youtubeConvert(url);
                var request = gapi.client.youtube.playlistItems.list({
                    part: 'snippet',
                    playlistId: convertedUrl,
                    maxResults: 1,
                });

                request.execute(function(response) {
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

    function requestPlaylist(playlistId, pageToken) {
        var requestOptions = {
            playlistId: playlistId,
            part: 'snippet',
            maxResults: 50
        };

        if (pageToken) {
            requestOptions.pageToken = pageToken;
        }

        var request = gapi.client.youtube.playlistItems.list(requestOptions);

        request.execute(function(response) {
            nextPageToken = response.nextPageToken;

            
            var playlistItems = response.result.items;

            if (playlistItems) {
                $.each(playlistItems, function(index, item) {
                    vidTitle.push(item.snippet.title);
                });
            } 
            else {
                $('#results').html('Sorry. There is no uploaded videos.');
            }
            
            if (pageToken) {
                nextPageToken = response.nextPageToken;

                if(nextPageToken) {
                    $.each(playlistItems, function(index, item) {
                        vidIds.push(item.snippet.resourceId.videoId);
                    });
                    return requestPlaylist(playlistId, nextPageToken);
                }
                else {
                    if(!$('script').attr('src=iframe_api')) {
                        loadScript();
                        $('#next-button').show();
                        a = vidTitle;
                        shuffle(vidIds, vidTitle);
                        abc = Object.assign({}, vidIds, vidTitle);
                        console.log(abc);
                        displayPlaylist(vidTitle)

                        return;
                    }
                }
                loadPlayer(vidIds);
            }
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
                    //done
                }
            }
        });
    }

    function displayPlaylist(vidTitle) {
        $('#playlist').append('<ul><li><a href="#">' + vidTitle[0] + '</a></li></ul>').show();

        $.each(vidTitle, function(index) {
        var showPlaylist = nextItem(vidTitle);
            $('#playlist').append('<ul><li><a href="#">' + showPlaylist + '</a></li></ul>').show();
        });
    }

    function displayTitle() {
        var b = nextTitle(vidTitle);
        document.title = b;
        $('#titles').html('<h2>' + b + '</h2><h3>Next: ' + nextOfNext(vidTitle) + '</h3>');
        $('#remaining').html('(remaining: ' + (abc.length - 1) + ')');
    }

    function nextSong() {
        $('#prev-button').show();
        displayTitle();

        var next = nextItem(vidIds);
        player.loadVideoById(next);
    }


    function previousSong() {
        var prevT = prevTitle(vidTitle);
        document.title = prevT;
        $('#titles').html('<h2>' + prevT + '</h2><h3>Next: ' + prevOfNext(vidTitle) + '</h3>');
        $('#remaining').html('(remaining: ' + vidTitle.length + ')');

        var prev = prevItem(vidIds);
        player.loadVideoById(prev);

        if(prev === vidIds[0]) {
            $('#prev-button').hide();
        }
    }

    function videoEnd(event) {
        if(event.data === 0) {
        var current = something(vidIds);
            if(document.getElementById('loop').checked) {
                player.cueVideoById(current);
            }
        console.log(current)
            // $('#prev-button').show();
            // displayTitle();
            // play();

        }
    }

     function onPlayerReady() {
        document.title = vidTitle[0];
        $('#remaining').html('(remaining: ' + vidTitle.length + ')');
        $('#titles').html('<h2>' + vidTitle[0] + '</h2><h3>Next: ' + nextOfNext(vidTitle) + '</h3>');
        $('#results').after('<br><hr class="underline"><br>');
        player.loadVideoById(vidIds[0]);
    }

    function play(id) {
        var next = nextItem(vidIds);
        player.loadVideoById(next);
    }

    function onYouTubeIframeAPIReady() {
        $('#loading').remove(); 
        $('#functionality').show();
        player = new YT.Player( 'results', {
            width: '640',
            height: '360',
            playerVars: { 
                'autoplay': 0,
                'controls': 1
            },
            events: { 
                'onReady': onPlayerReady,
                'onStateChange': videoEnd
            }
        });
    }

    function loadPlayer() {
        window.onYouTubePlayerAPIReady = function() {
            onYouTubeIframeAPIReady();
        };
    }

    function youtubeValidate(url) {
        var regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if(match) {
            return match[1];
        }
        else {
            console.log("hej");
        }

    }

    function youtubeConvert(url) {
        var regExp = /[&?]list=([^&]+)/i;
        var match = url.match(regExp);
        if (match) {
            return match[1];
        }
        else {

        }
    }


    //variables
    var playlistId, nextPageToken, prevPageToken, player, showPlaylist, prevPress;
    var vidIds = [];
    var vidTitle = [];
    var vidDesc = [];

    $(".show-more a").click(function(e) {
        e.preventDefault();
        var linkText = $(this).text().toUpperCase();

        if(linkText === "SHOW MORE") {
            linkText = "Show less";
            $(".desc").switchClass("hideDesc", "showDesc", 400);
        }
        else {
            linkText = "Show more";
            $(".desc").switchClass("showDesc", "hideDesc", 400);
        }
        $(this).text(linkText);
    });

    $('#playlist').click( function(event) {
      event.preventDefault();
    });

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
                    vidDesc.push(item.snippet.description);
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
                        shuffle(vidIds, vidTitle, vidDesc);
                        displayPlaylist(vidTitle)
                        prevNextListener(vidIds);


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
        var count = 1;
        var anchorId = 0;
        $('#playlist').append('<h3>Current randomized Playlist:</h3><br><ul><li>' + 1 + ' - <a href="#" onClick="getPlaylistId();">' + vidTitle[i] + '</a></li></ul>').show();

        $.each(vidTitle, function(index) {
        var showPlaylist = nextItem(vidTitle);
            //adding an id to the href anchors
            $('#playlist').append('<ul><li>' + (count += 1) + ' - <a href="#'+ (anchorId += 1) +'" onClick="getPlaylistId();">' + showPlaylist + '</a></li></ul>').show();
        });
    }

    function reRandomize() {
        shuffle(vidIds, vidTitle, vidDesc);
        // var rndVidIds = vidIds;

        $('#playlist').empty();
        $('#prev-button').hide();
        $('#remaining').html('(remaining: ' + vidTitle.length + ')');
        $('#titles').html('<h2>' + vidTitle[0] + '</h2>');
        $('.desc').html('<br>' + vidDesc[0]);

        displayPlaylist(vidTitle);
        player.loadVideoById(vidIds[0]);
    }

    //getting index of the playlist li
    function getPlaylistId() {
        var g = document.getElementById('playlist');

        for (var i = 0, len = g.children.length; i < len; i++) {
            (function(index){
                g.children[i].onclick = function(){
                    var aId = $('a', this).attr("href");

                    player.loadVideoById(vidIds[index-2]);
                    document.title = vidTitle[index-2];
                    $('#titles').html('<h2>' + vidTitle[index-2] + '</h2><h3>Next: ' + vidTitle[index-1] + '</h3>');

                    //looking for the anchor id's and creating a scroll function
                    function scrollToAnchor(aId){
                        var aTag = $("a[href="+ aId +"]");
                        $('#playlist').animate({scrollTop: aTag.position().top + $(window).height},'slow');
                    }
                    scrollToAnchor(aId);
                }
            })(i);

        }
    }

    //displaying current video title and next video title
    function displayTitle() {
        var b = nextTitle(vidTitle);
        document.title = b;
        $('#titles').html('<h2>' + b + '</h2><h3>Next: ' + nextOfNext(vidTitle) + '</h3>');
        $('#remaining').html('(remaining: ' + (vidTitle.length -= 1) + ')');
    }

    //displaying video description
    function displayDesc() {
        $('.desc').html('<br>' + vidDesc[i+1]);
    }

    //plays next video on click function
    function nextSong() {
        $('#prev-button').show();
        displayTitle();
        displayDesc();

        //loads next item in array
        var next = nextItem(vidIds);
        player.loadVideoById(next);
    }

    //plays previous video on click function
    function previousSong() {
        var prevT = prevTitle(vidTitle);
        document.title = prevT;
        $('#titles').html('<h2>' + prevT + '</h2><h3>Next: ' + prevOfNext(vidTitle) + '</h3>');
        $('#remaining').html('(remaining: ' + (vidTitle.length += 1) + ')');
        $('.desc').html('<br>' + vidDesc[i-1]);

        //loads previous item in array
        var prev = prevItem(vidIds);
        player.loadVideoById(prev);

        //hides previous button if you're at the beginning of index
        if(prev === vidIds[0]) {
            $('#prev-button').hide();
            $('#prev-button').off('keypress', prevNextListener);
        }
    }

    //listens to p and n keypresses to change songs.
    var prevNextListener = function(string) {
        var prev = prevItem(string);
        document.addEventListener("keypress", function onEvent(event) {
            if(event.key === "n") {
                $(this).off('keypress', prevNextListener);
                nextSong();
            }
        });
        document.addEventListener("keypress", function onEvent(event) {
            if(event.key === "p") {
                if(prev !== string[i]) {
                    $(this).off('keypress', prevNextListener);
                    previousSong();
                }
            }
        });

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
                displayDesc();
                play();
            }

        }
    }

    //loads after the player is ready
     function onPlayerReady() {
        getPlaylistId();
        document.title = vidTitle[i];
        $('#remaining').html('(remaining: ' + vidTitle.length + ')');
        $('#titles').html('<h2>' + vidTitle[i] + '</h2><h3>Next: ' + nextOfNext(vidTitle) + '</h3>');
        $('.desc').html('<br>' + vidDesc[i]);
        $('.show-more').show();
        $('.text-container').after('<hr class="underlineL">');
        player.loadVideoById(vidIds[i]);

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
            width: '800',
            height: '450',
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

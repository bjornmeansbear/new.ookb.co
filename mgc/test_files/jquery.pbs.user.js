/*globals document, jQuery, window, PBS, jwSettings, jwplayer, $*/
// check if global PBS object exists

if (!window.PBS) {
    window.PBS = {};
}

PBS.User = (function () {
    'use strict';
    var userData = {},
        videosInPage,
        playlistVideos,
        currentPage = document.querySelector('.pageContainer').getAttribute('id');

	// returns is logged in
    function isLoggedIn() {
        return userData.has_uid;
    }
    // adds bubble for the add to watchlist videos
    function addWatchlistCount(total) {
        if ($('.bubble').length === 0) {
            $('.bubbleHolder').append('<span class="bubble">' + total + '</span>');
        }
    }
	// sing in user template
    function userInfoTemplate(data) {
        var template = '';
        template += '<div class="userContainer">';
        if (data.profile_photo_url) {
            template += '<img src="' + data.profile_photo_url + '"/>';
        }
        template += '<div class="userInfo">';
        template += '<strong>' + data.profile_display_name + '&nbsp;&nbsp;';
        if (data.has_plus_membership) {
            template += '<span class="inline-plus user-plus">PLUS</span>';
        }
        template += '</strong>';
        template += '</div>';
        template += '</div>';
        template += '<div class="socialContainer">';
        template += '<span class="sign-out"><a href="javascript:PBS.Profile.logOut();">Sign Out</a></span>';
        template += '</div>';

        return template;
    }
    // add the help message
	function addHelpMessage() {
        var target = document.querySelector('#kidsShop'),
            message = document.querySelector('#mvodVideoIssues');

        if (!message) {
            if (target) {
                target.insertAdjacentHTML('beforebegin', '<h5 id="mvodVideoIssues">Having problems with PLUS videos? Get support at <a href="http://help.pbs.org" target="_blank">help.pbs.org</a>.</h5>');
            }
        }
    }
    // toggle favorite/featured programs carousel
    function toggleFavorite(show) {
        var showFeaturedHome = $("#showFeaturedHome"),
            showFavoriteHome = $("#showFavoriteHome"),
            favoritePrograms = $("#favoriteProgramsContainer"),
            featuredPrograms = $("#featuredProgramsContainer");

        if (show) {
            favoritePrograms.show();
            featuredPrograms.hide();
            showFeaturedHome.addClass("linkAvailable");
            showFavoriteHome.removeClass("linkAvailable");
        } else {
            favoritePrograms.hide();
            featuredPrograms.show();
            showFeaturedHome.removeClass("linkAvailable");
            showFavoriteHome.addClass("linkAvailable");
        }
    }

    /*globals window*/
    function homePage(data) {
        var showFeaturedHome = $("#showFeaturedHome"),
            showFavoriteHome,
            continue_watching = data.continue_watching,
            favorite_programs = data.favorite_programs,
            plus_banner = data.plus_banner;

        //  add continue watching videos
        if (continue_watching) {
            $('#continueWatchingHome').html(continue_watching);
        }
        // add favorite programs
        if (favorite_programs) {
            $('#featuredFavoriteProgramsContainer h2').append('<span id="showFavoriteHome" class="linkAvailable">Favorite Programs</span>');
            $('#favoriteProgramsContainer').html(favorite_programs);
        }
        if (plus_banner){
            $('#plusBannerHome').html(plus_banner);
        }
        showFavoriteHome = $("#showFavoriteHome");

        showFavoriteHome.on("click", function () { toggleFavorite(true); });
        showFeaturedHome.on("click", function () { toggleFavorite(false); });

        toggleFavorite(false);
    }
    // update the favorite program / only program page
    function programPage(data) {
        var currentProgram = $('.pageContainer').data('program'),
            favorite_programs_slugs = data.favorite_program_slugs;

        // update the favorite program
        if (currentProgram !== '') {
            if (favorite_programs_slugs.indexOf(currentProgram) !== -1) {
                $('#programFavAnchorRemove').css('display', 'block');
                $('#programFavAnchor').hide();
            }
        }
    }
    // update the add to favorite signs for in page video items
    function updateFavoriteVideos(data) {
        var elem = $(".videoList").find("[data-id='" + data + "']").find('.nav-icon');

        if (elem.length > 0) {
            elem.removeClass('plus')
                .addClass('minus')
                .html('&nbsp;');
        }
    }
    // update favorite video / only video page
    function videoPage(data) {
        var currentVideo = (window.location.pathname).replace(/\D/g, ''),
            favorite_videos = userData.favorite_video_ids,
            total_favorite_videos = favorite_videos.length;

        if ($('#hdNotification').length > 0) {
            $('#hdNotification').hide();
        }
        if (total_favorite_videos > 0) {
            if (favorite_videos.indexOf(currentVideo.toString()) !== -1) {
                $('#pageDescription .watchlistAdd').find('span')
                    .html('&nbsp;')
                    .removeAttr('class')
                    .addClass('nav-icon minus');
            } else {
                if (PBS.hasOwnProperty('videoPage')) {
                    PBS.videoPage.setAddToWatchlistParams(true);
                }
            }
        }
    }
    // watchlist page
    function watchlistPage() {
        $('#loggedIn').show();
        $("#notLoggedIn").hide();
    }

    function updateUserData(data) {
        var userTemplate = userInfoTemplate(data),
            favorite_videos = userData.favorite_video_ids,
            total_favorite_videos = favorite_videos.length;

        if (total_favorite_videos > 0) {
            addWatchlistCount(total_favorite_videos);
        }

		// add user info (name, picture, sing in/out)
        $('.userInfo').html(userTemplate);
    }

    function processFavoriteVideosData() {
        var favorite_videos = userData.favorite_video_ids,
            videoId,
            key,
            inPageIds = [];

        videosInPage = $('.videoItem');

		if (userData.hasOwnProperty('favorite_video_ids')) {
            if (favorite_videos.length > 0 && currentPage !== 'watchlist') {
                // get all the video ids from the current page
                if (videosInPage.length > 0) {
                    videosInPage.each(function (index, obj) {
                        inPageIds[index] = $(obj).data('id');
                    });

                    // get the index of the video item that need to be updated
                    for (key in inPageIds) {
                        if (inPageIds.hasOwnProperty(key)) {
                            videoId = inPageIds[key].toString();
                            if (favorite_videos.indexOf(videoId) !== -1) {
                                updateFavoriteVideos(videoId);
                            }
                        }
                    }
                }
            }
        }
    }

    function updatePage(data) {
        switch (currentPage) {
        case 'home':
            homePage(data);
            break;
        case 'video':
            videoPage(data);
            break;
        case 'individualProgram':
            programPage(data);
            break;
        case 'watchlist':
            watchlistPage();
            break;
        }
    }

    function createPlayList(ids) {
        var currentVideoId = (window.location.pathname).replace(/\D/g, ''),
            currentIndex = ids.indexOf(currentVideoId),
            totalVideos = ids.length,
            playlistTemplate = '',
            target = document.querySelector('#frame'),
            playlist = document.querySelector('#playlistHandler');

        if (playlist) {
            playlist.parentNode.removeChild(playlist);
        }

        if (currentIndex !== -1 && totalVideos > 1) {
            playlistTemplate += '<div id="playlistHandler" ' + ((currentIndex === 0) ? 'class="noPrev"' : '') + '>';
            if (currentIndex !== 0) {
                playlistTemplate += '<a href="javascript:redirectAtEndOfPlaylist=false; playlistDirectionForward = false; PBS.videoPage.loadNewVideo(' + ids[currentIndex - 1] + ');" id="prevInPlaylist" class="navigatePlaylist flLeft"><span class="blueArrow-left"></span> Prev<span class="hide break480">ious</span> <span class="hide break768">Video</span></a>';
            }
            playlistTemplate += '<span class="boldText"><span class="break320">Playing </span><span class="hide break600">your <a href="/watchlist/">Watchlist </a></span></span>: Video ';
            playlistTemplate += '<span id="currentInPlaylist">' + (currentIndex + 1) +  '</span> of ';
            playlistTemplate += '<span id="totalInPlaylist">' + totalVideos + '</span>';
            if ((currentIndex + 1) !== totalVideos) {
                playlistTemplate += '<a href="javascript: playlistDirectionForward=true; PBS.videoPage.loadNewVideo(' + ids[currentIndex + 1] + ')" id="nextInPlaylist" class="navigatePlaylist flRight">Next <span class="hide break768">Video</span><span class="blueArrow-right"></span></a>';
            }
            playlistTemplate += '</div>';

            target.insertAdjacentHTML('afterend', playlistTemplate);

            if ( currentIndex + 1 === totalVideos ) {
               redirectAtEndOfPlaylist = true;
            } else {
                redirectAtEndOfPlaylist = false;
            }
        }
    }
    function removePlaylist() {
        var playlist = document.querySelector('#playlistHandler');
        if ( playlist )
            playlist.parentNode.removeChild(playlist); // because IE11 does not just support .remove();
    }

    function playNextInPlaylist() {
        if (!Array.isArray(playlistVideos)) {
            return;
        }
        var currentVideoId = (window.location.pathname).replace(/\D/g, ''),
            currentIndex = playlistVideos.indexOf(currentVideoId),
            totalVideos = playlistVideos.length;

        if ((currentIndex + 1) !== totalVideos && playlistVideos[currentIndex + 1]) {
            PBS.videoPage.loadNewVideo(playlistVideos[currentIndex + 1]);
        }
        else {
           // reached the end of playlist
           window.location.href = "/watchlist/";
        }
    }

    function playPrevInPlaylist() {
        if (!Array.isArray(playlistVideos)) {
            return;
        }
        var currentVideoId = (window.location.pathname).replace(/\D/g, ''),
            currentIndex = playlistVideos.indexOf(currentVideoId),
            totalVideos = playlistVideos.length;

        if ((currentIndex - 1) !== totalVideos && playlistVideos[currentIndex -1]) {
            PBS.videoPage.loadNewVideo(playlistVideos[currentIndex -1]);
        } else {
           // reached the begining of playlist or the video is undefined
           window.location.href = "/watchlist/";
        }
    }



    function init() {
        $.ajax({
            url: '/userdata/',
            data : (currentPage === 'home' ? { 'p' : 'home' } : {})
        }).done(function (data) {
            if (data.has_uid) {
                // add help message for members that have a plus membership
                if (data.hasOwnProperty('has_plus_membership') && data.has_plus_membership) {
                    addHelpMessage();
                } else if (currentPage === 'home' && $('.expiringHome')) {
                    $('.expiringHome').show();
                }
                userData = data;
                updateUserData(data);
                // update content based on the current page
                updatePage(data);
                if (currentPage !== 'video') {
                    processFavoriteVideosData(data);
                }
                if (currentPage === 'video') {
                    if ( PBS.Helper.getUrlVar('playlist') && typeof jwSettings !== 'undefined') {
                        if (jwSettings.playerType === 'portal' && data.favorite_video_ids.length > 0) {
                            createPlayList(data.favorite_video_ids);
                            playlistVideos = data.favorite_video_ids;
                        } else {
                            removePlaylist();
                        }
                    } else {
                        removePlaylist();
                    }
                }
            } else {
                $('.socialContainer').html('<span class="sign-in"><a href="javascript:PBS.Profile.signIn(\'LNK\', \'Nav Link\', \'sign-in\');">Sign In</a></span>');
                if (currentPage === 'home' && $('.expiringHome')) {
                    $('.expiringHome').show();
                }
            }
        }).error(function (data) {
            $('.socialContainer').html('<span class="sign-in"><a href="javascript:PBS.Profile.signIn(\'LNK\', \'Nav Link\', \'sign-in\');">Sign In</a></span>');
        });
    }

    init();

    return {
        init : init,
        isLoggedIn : isLoggedIn,
        processFavoriteVideosData : processFavoriteVideosData,
        playNextInPlaylist : playNextInPlaylist,
        playPrevInPlaylist : playPrevInPlaylist
    };

}());

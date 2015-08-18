/*globals PBS, window, jwplayer, jQuery, setTimeout, console, jwSettings, document*/
(function (window, $) {
    "use strict";

    if (!window.PBS) {
        window.PBS = {};
    }

    PBS.jwIframePlayer = (function () {

        var SETTINGS, PLAYER, VIDEOINFO, iframeScreens, $topIcons,
            playerType,
            iframeElems = {
                topbar : '#topBar',
                infoScreen : '#playerInfoScreen',
                embedScreen : '#playerEmbedScreen',
                shareScreen : '#playerShareScreen',
                buyScreen : '#playerBuyScreen',
                viral : {
                    endScreen : '.viralEndScreen'
                }
            };

        function makeActive(tag) {
            iframeScreens.find(tag).addClass('active').siblings().removeClass('active');
            return true;
        }

        function getGATrackVideoLabel() {
            var programTitle = VIDEOINFO.program.title,
                videoTitle = VIDEOINFO.title,
                videoId = VIDEOINFO.contentID,
                trackLabel = (programTitle ? programTitle + ' | ' : '') + videoTitle + ' | ' + videoId;
            return trackLabel;
        }

        function share(type, videoTitle) {
            var gaTrackLabel = getGATrackVideoLabel(), win;
            switch (type) {
            case 'facebook':
                PBS.GA.trackEvent(playerType, 'Facebook Post', gaTrackLabel);
                window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(window.location.href), "", "width=420,height=320,location=0,menubar=0,scrollbars=0,status=1,resizable=0");
                break;
            case 'twitter':
                PBS.GA.trackEvent(playerType, 'Twitter Post', gaTrackLabel);
                window.open('http://twitter.com/share?text=' + encodeURIComponent(videoTitle) + '&url=' + encodeURIComponent(window.location.href), "", "width=420,height=320,location=0,menubar=0,scrollbars=0,status=1,resizable=0");
                break;
            case 'email':
                PBS.GA.trackEvent(playerType, 'Email Sent', gaTrackLabel);
                win = window.open('mailto:?body=I thought you might like this : ' + encodeURIComponent(window.location.href), 'emailWindow');
                if (win && win.open && !win.closed) {
                    win.close();
                }
                break;
            case 'google':
                PBS.GA.trackEvent(playerType, 'Google+ Post', gaTrackLabel);
                window.open('https://plus.google.com/share?url=' + encodeURIComponent(window.location.href), "", "width=420,height=320,location=0,menubar=0,scrollbars=0,status=1,resizable=0");
                break;
            }
        }

        function bindTopIcons() {
            $topIcons.find('.item').each(function () {
                var $this = $(this);
                $this.on('click', function () {
                    var state = typeof PLAYER.getState === 'function' ? PLAYER.getState() : '';
                    if (state === 'PLAYING') {
                        PLAYER.pause();
                    }
                    $this.addClass('active').siblings().removeClass('active');
                    // info
                    if ($this.hasClass('info')) {
                        makeActive(iframeElems.infoScreen);
                    }
                    // embed
                    if ($this.hasClass('embed')) {
                        makeActive(iframeElems.embedScreen);
                    }
                    // share
                    if ($this.hasClass('share')) {
                        makeActive(iframeElems.shareScreen);
                    }
                    // buy
                    if ($this.hasClass('buy')) {
                        makeActive(iframeElems.buyScreen);
                    }
                });
            });
        }

        function bindCloseBtn() {
            var playableInformation = PBS.jwPlayer.getPlayableParams(VIDEOINFO);

            iframeScreens.find('.closeTab').on('click', function (event) {
                var $this = $(this),
                    state = PLAYER.getState();

                switch (state) {
                case 'IDLE':
                    if (PBS.jwPlayer.isFinished()) {
                        PLAYER.seek(playableInformation.start);
                    }
                    break;
                case 'PAUSED':
                    PLAYER.play();
                    break;
                }

                $this.closest('.active').removeClass('active');
                $topIcons.find('.active').removeClass('active');

                event.preventDefault();
            });
        }

        function hideDescription() {
            var hidden = false;
            PLAYER.onPlay(function () {
                iframeScreens.find('.viralPlayerDescription').addClass('hide');
            });
            PLAYER.onAdTime(function () {
                if (!hidden) {
                    iframeScreens.find('.viralPlayerDescription').addClass('hide');
                }
            });
        }

        function onVideoFinish() {
            PLAYER.onComplete(function () {
                if (PLAYER.getFullscreen()) {
                    PLAYER.setFullscreen(false);
                }
                makeActive(iframeElems.viral.endScreen);
            });
        }

        function init(info, player) {
            var currentLocation = document.location.origin.replace(/\/?$/, '/');

            PLAYER = player;
            SETTINGS = jwSettings;
            VIDEOINFO = info;
            iframeScreens = $('#iframePlayer');
            $topIcons = $(iframeElems.topbar).find('.topIcons');

            iframeScreens.find('.viralPlayerDescription').removeClass('hide');

            hideDescription();
            onVideoFinish();

            bindTopIcons();
            bindCloseBtn();
            PBS.Helper.updateEmbedDimensions(iframeElems.embedScreen,
                                                currentLocation,
                                                VIDEOINFO.contentID);

            switch (SETTINGS.playerType) {
            case 'viral':
                playerType = 'Video – Viral Player';
                break;

            case 'partner':
                playerType = 'Video - Partner Player';
                break;
            default:
                playerType = 'Video - Portal';
                break;
            }

            // attach GA track for info screen
            $('.item.info').on('click', function () {
                PBS.GA.trackEvent(playerType, 'Details Menu',
                                    getGATrackVideoLabel());
            });
            // attach GA track for embed screen
            $('.item.embed').on('click', function () {
                PBS.GA.trackEvent(playerType, 'Embed Copy',
                                    getGATrackVideoLabel());
            });
            // attach GA track to buy from iTunes link
            $('.viraliTunesLink').on('click', function () {
                PBS.GA.trackEvent(playerType, 'iTunes',
                                    getGATrackVideoLabel());
            });
            // attach GA track to buy DVD link
            $('.viralbuyDVDLink').on('click', function () {
                PBS.GA.trackEvent(playerType, 'shopPBS',
                                    getGATrackVideoLabel());
            });
        }

        return {
            init : init,
            getGATrackVideoLabel : getGATrackVideoLabel,
            makeActive : makeActive,
            share : share
        };
    }());

}(window, jQuery));
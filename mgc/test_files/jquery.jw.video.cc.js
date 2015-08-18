/*globals PBS, jQuery, window, jwplayer, setTimeout*/
/*jslint regexp: true*/
(function (window, $) {
    'use strict';

    if (!window.PBS) {
        window.PBS = {};
    }

    PBS.jwCCSettings = (function () {
        var ccSettings,
            initialSetting = {
                back : true,
                color : 'ffffff',
                fontsize : 15,
                fontfamily : 'Arial',
                edgeStyle : 'none',
                backgroundColor : '#000000',
                windowColor : '#0000FF',
                fontOpacity : 100,
                backgroundOpacity : 100,
                windowOpacity : 0
            },
            main = '#ccSettings',
            preview = '#ccPreview',
            previewWColor = '#previewWindowColor',
            previewText = '#previewText',
            colorSelector = '#ccConf li[data-setting]',
            rangeSelector = '#fontsize, #fontOpacity, #backgroundOpacity, #windowOpacity',
            optionSelector = '#fontfamily, #edgeStyle',
            defaultTextColorRGB,
            defaultBackgroundColorRGB,
            defaultWindowColorRGB;

        function hex2rgb(hex) {
            hex = /^#?(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/i.exec(hex)[1];
            /* double each item if the hex is a shorthand version */
            hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;
            /* split the hex string into an array */
            hex = hex.match(/../g);

            return [parseInt(hex[0], 16), parseInt(hex[1], 16),
                                                        parseInt(hex[2], 16)];
        }

        function updateRangePreview(id, val) {
            if (id !== 'fontsize') {
                val += "%";
            }

            $('#' + id + 'Preview').text(val);
        }

        function rangePercentOptimiziation(val) {
            return parseInt(val, 10) / 100;
        }

        function rgba(rgb, a, decorator) {
            if (decorator === false) {
                return rgb.join(',') + ',' + rangePercentOptimiziation(a);
            }

            return 'rgba(' + rgb.join(',') + ',' + rangePercentOptimiziation(a) + ')';
        }

        function updatePreview(prop, val) {
            if (!val) { return; }

            switch (prop) {
            case 'fontsize':
                $(preview).css('font-size', val + 'px');
                ccSettings.fontsize = val;
                break;
            case 'fontfamily':
                $(preview).css('font-family', val);
                ccSettings.fontfamily = val;
                break;
            case 'edgeStyle':
                $(preview).attr('class', val);
                ccSettings.edgeStyle = val;
                break;
            case 'color':
                defaultTextColorRGB = hex2rgb(val);
                $('#fontOpacity').val(100);
                updateRangePreview('fontOpacity', 100);
                $(previewText).css('color', '#' + val);
                ccSettings.color = val;
                updatePreview('fontOpacity', 100);
                break;
            case 'backgroundColor':
                defaultBackgroundColorRGB = hex2rgb(val);
                $('#backgroundOpacity').val(100);
                updateRangePreview('backgroundOpacity', 100);
                $(previewText).css('background-color', '#' + val);
                ccSettings.backgroundColor = val;
                updatePreview('backgroundOpacity', 100);
                break;
            case 'windowColor':
                defaultWindowColorRGB = hex2rgb(val);
                $('#windowOpacity').val(100);
                updateRangePreview('windowOpacity', 100);
                $(previewWColor).css('border-color', '#' + val);
                ccSettings.windowColor = val;
                updatePreview('windowOpacity', 100);
                break;
            case 'fontOpacity':
                $(previewText).css('color', rgba(defaultTextColorRGB, val));
                ccSettings.fontOpacity = val;
                break;
            case 'backgroundOpacity':
                $(previewText).css('background-color', rgba(defaultBackgroundColorRGB, val));
                ccSettings.backgroundOpacity = val;
                break;
            case 'windowOpacity':
                $(previewWColor).css('border-color', rgba(defaultWindowColorRGB, val));
                ccSettings.windowOpacity = val;
                break;
            }
        }

        function reloadPage(msg) {
            PBS.MobileWeb.showPageLoadingMsg(msg);

            // hide message after 1 second
            setTimeout(function () {
                PBS.MobileWeb.hidePageLoadingMsg();

                if (window.opener) {
                    if(window.opener.PBS.jwPlayer)
                    {
                        window.opener.PBS.jwPlayer.reloadPlayer(true);
                    }
                    else
                    {
                        window.opener.history.go();
                    }
                    window.close();
                } else {
                    hide();
                    PBS.jwPlayer.reloadPlayer(true);
                }
            }, 1000);
        }

        function resetCCSettings() {
            ccSettings = initialSetting;

            // erase ccSettings cookie
            $.cookie("ccSettings", null, {
                expires : -1,
                path : '/',
                domain : ''
            });

            // remove styles and classes from preview div
            $(preview).removeAttr('class').removeAttr('style');
            $(previewWColor).removeAttr('style');
            $(previewText).removeAttr('style');

            // set font-size to default size
            $('#fontSize').val(ccSettings.fontSize);
            updateRangePreview('fontSize', ccSettings.fontSize);

            // reset opacity selectors to default
            $('#fontOpacity, #backgroundOpacity').each(function (index, obj) {
                $(obj).val(100);
                updateRangePreview($(obj)[0].id, 100);
            });


            $('#windowOpacity').val(ccSettings.windowOpacity);
            updateRangePreview($('#windowOpacity')[0].id, ccSettings.windowOpacity);
            updatePreview('windowOpacity', ccSettings.windowOpacity);

            // reset font options selectors to default
            $('#fontfamily').val('arial');
            $('#edgeStyle').val('none');

            // reset color options to default
            $('#fontColor > li').siblings().removeClass('active');
            $('#fontColor > li[data-option="ffffff"]').addClass('active');

            $('#backgroundColor > li').siblings().removeClass('active');
            $('#backgroundColor > li[data-option="000000"]').addClass('active');

            $('#windowColor > li').siblings().removeClass('active');
            $('#windowColor > li[data-option="0000ff"]').addClass('active');

            // reload page and show message
            reloadPage("Reseting ...");
        }

        function saveCCSettings() {
            if (!$.isEmptyObject(ccSettings)) {
                $.cookie("ccSettings", JSON.stringify(ccSettings), {
                    expires : 356,
                    path : '/',
                    domain : ''
                });

                // reload page and show message
                reloadPage("Saving ...");
            }
        }

        function setHandlers() {
            // all the options that have data-settings
            $(colorSelector).on('click', function () {
                var $this = $(this);

                $this.addClass('active').siblings().removeClass('active');

                updatePreview($this.attr('data-setting'), $this.attr('data-option'));
            });

            // font size range input
            $(rangeSelector).on('change click', function () {
                var $this = $(this),
                    min = $this.attr('min'),
                    max = $this.attr('max'),
                    val = parseInt($this.val(), 10);

                if ($.browser.msie && parseInt($.browser.version, 10) < 10) {
                    val = (val < min) ? min : val;
                    val = (val > max) ? max : val;
                    $this.val(val);
                }

                updatePreview($this[0].id, val);
                updateRangePreview($this[0].id, val);
            });

            $(optionSelector).on('change click', function () {
                var $this = $(this);

                updatePreview($this[0].id, $this.val());
            });

            // reset button
            $('#resetCC').on('click', function () { resetCCSettings(); });

            // save button
            $('#saveCC').on('click', function () { saveCCSettings(); });

            // close
            $('#ccSettings .header-close').on('click', function () {
                $('#ccSettings').hide();
                if (jwplayer().getState() === "PAUSED") {
                    jwplayer().play();
                }
            });
        }

         function show() {
            $(main).show();
        }

        function hide() {
            $(main).hide();
        }

        function init() {
            ccSettings = $.cookie("ccSettings") ? JSON.parse($.cookie("ccSettings")) : initialSetting;

            setHandlers();

            defaultTextColorRGB = hex2rgb(ccSettings.color);
            defaultBackgroundColorRGB = hex2rgb(ccSettings.backgroundColor);
            defaultWindowColorRGB = hex2rgb(ccSettings.windowColor);

            // set active the colors
            $('#fontColor > li[data-option="' + ccSettings.color + '"]').addClass('active');
            $('#backgroundColor > li[data-option="' + ccSettings.backgroundColor + '"]').addClass('active');
            $('#windowColor > li[data-option="' + ccSettings.windowColor + '"]').addClass('active');

            // set the alphas for the preview div
            $(previewText).css('color', rgba(defaultTextColorRGB, ccSettings.fontOpacity));
            $(previewText).css('background-color', rgba(defaultBackgroundColorRGB, ccSettings.backgroundOpacity));
            $(previewWColor).css('border-color', rgba(defaultWindowColorRGB, ccSettings.windowOpacity));
        }

        return {
            show : show,
            hide : hide,
            init : init
        };

    }());
}(window, jQuery));
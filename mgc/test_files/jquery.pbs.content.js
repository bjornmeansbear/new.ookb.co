/*globals window, jQuery, PBS, CUSTOM_HEADERS, STATIC_URL*/
(function(window, $) {
    "use strict";
    if (!window.PBS) {
        window.PBS = {};
    }

    PBS.Content = (function () {

        function renderTemplate(template, mapping, list, data) {
            var htmlData = '', i, key, itemHtml;

            if (data && data.length) {
                for (i in data) {
                    if (Object.prototype.hasOwnProperty.call(data, i)) {
                        itemHtml = template;
                        for (key in mapping) {
                            if (Object.prototype.hasOwnProperty.call(mapping, key)) {
                                itemHtml = itemHtml.replace(new RegExp('{' + key + '}', 'gi'), eval(mapping[key]));
                            }
                        }
                        htmlData += itemHtml;
                    }
                }

            } else if (!list.children(':not(#loadMore)').length) {
                htmlData += '<li id="noItems">There are no items to be displayed.</li>';
            }
            return htmlData;
        }

        function appendToListContent(template, mapping, list, data) {
            list.append(renderTemplate(template, mapping, list, data));
        }

        function displayListContent(template, mapping, list, data) {
            var children = list.children(':not(#loadMore)');
            if (!children.length) {
                children.remove();
                list.prepend(renderTemplate(template, mapping, list, data));
            }
        }

        function checkEOL(list, data, count) {
            if (data.length < count) {
                list.find('#loadMore').remove();
            }
        }

        function refreshList(list, count) {
            var loadMoreAnchor = list.find('#loadMore'), listSize, href;
            if (loadMoreAnchor.length) {
                listSize = parseInt(list.find('li').length, 10) - 1;
                href = loadMoreAnchor.find('a').attr('href').replace(/start\/[\d\.]+/g, "start/" + listSize).replace(/end\/[\d\.]+/g, "end/" + (listSize + count));

                loadMoreAnchor.find('a').attr('href', href);
                if (list.find('li:last').attr('id') !== 'loadMore') {
                    list.find('#loadMore').insertAfter(list.find('li:last'));
                }
            }
        }

        function getVideoTag(src) {
            switch (src) {
            case '#previews':
                return 'previews';
            case '#shorts':
                return 'shorts';
            // case '#episodes':
            default:
                return 'episodes';
            }
        }

        function loadMoreItems(url, container, template, mapping, append, callback) {
            var count = PBS.MobileWeb.ITEMS_PER_PAGE;
            container.append($("<li id='loading' />"));
            container.find('#loadMore').hide();
            $.ajax({
                url : url,
                headers : CUSTOM_HEADERS,
                success : function(data) {
                    container.find('#loading').remove();
                    container.find('#loadMore').show();
                    checkEOL(container, data, count);
                    if (append) {
                        appendToListContent(template, mapping, container, data);
                    } else {
                        displayListContent(template, mapping, container, data);
                    }
                    refreshList(container, count);
                    PBS.MobileWeb.videoListsConfig();

                    if ($.isFunction(callback)) {
                        callback();
                    }
                }
            });
        }

        function loadMoreItemsJSON(data, container, template, mapping, append, callback) {
            var count = PBS.MobileWeb.ITEMS_PER_PAGE, i;
            container.append($("<li id='loading' />"));
            // container.find('#loadMore').hide();
            for (i = 0; i < data.length; i += 1) {
                appendToListContent(template, mapping, container, data[i]);
                if (append) {
                    appendToListContent(template, mapping, container, data);
                } else {
                    displayListContent(template, mapping, container, data);
                }
            }
            refreshList(container, count);
            PBS.MobileWeb.videoListsConfig();

            if ($.isFunction(callback)) {
                callback();
            }
        }

        /**
         * Create a fallback image if the current img fails to load
         *
         * @param  {DOM}     image
         * @param  {Boolean} isSquare
         * @return {void}
         */
        function onImageFallback(image, isSquare) {
            var parent = image.parentNode,
                newElType = 'span',
                newEl;

            // temporary solution - we will replace all with jQuery when we'll be able to properly test locally
            var $image = $(image), $parent = $(parent);

            /**
             * For Program Logo on programs page just remove the image
             */

            if ($image.hasClass('programlogo')) {
                /** image.remove() doesn't work in IE */
                return parent.removeChild(image);
            }

            /**
             * For Program Logo on individual program page create an h2
             */
            if (image.id === 'programLogo') {
                newElType = 'h2';
            }

            newEl = document.createElement(newElType);

            switch (newElType) {
                case 'span':
                    if (isSquare) {
                        newEl.className = 'imageFallbackSquare';
                    } else {
                        newEl.className = 'imageFallbackWide';
                    }

                    $parent.addClass('imageFallback');
                    break;

                case 'h2':
                    newEl.id = 'programTitle';
                    newEl.innerHTML = image.alt;
                    /** image.remove() doesn't work in IE */
                    parent.removeChild(image);
                    break;
            }

            parent.insertBefore(newEl, parent.firstChild);
        }

        function onLogoFallback(image) {
            image.style.display = "none";
            $(".stationTextOnError").addClass("showText");
        }

        function getExpireDateLabel(expire_date) {
            var one_day = 1000 * 60 * 60 * 24,
                now = new Date(),
                current_date = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                expiring = expire_date.split('/'),
                expiring_date = new Date(expiring[2], expiring[0] - 1, expiring[1]),
                no_of_days = (expiring_date - current_date) / one_day;

            if (0 <= no_of_days <= 9) {
                if (no_of_days === 0) {
                    return "Today";
                }
                if (no_of_days === 1) {
                    return "Tomorrow";
                }
                return "in " + no_of_days + " Days";
            }
            return "on " + expire_date;
        }

        var NO_IMAGE = STATIC_URL + 'img/no_image_480_270.jpg',
            PBS_LOGO = STATIC_URL + 'img/generic_logo_480_270.jpg',

            defaultMapping = {
                contentID: 'data[i].contentID',
                slug: 'data[i].slug ? data[i].slug: ""',
                data: 'data[i].poster_url ? PBS.ResponsiveImages.mark({0: 480, 256: 256}) : ""',
                poster: 'data[i].poster_url ? PBS.ResponsiveImages.getResizedSrc(data[i].poster_url) : NO_IMAGE',
                pbs_logo: 'PBS_LOGO',
                expiration_info: 'data[i].expiredate && data[i].expiring_soon ? \'<span class="expiring">Expires \' + getExpireDateLabel(data[i].expiredate) + "</span>" : ""',
                program_title: 'data[i].program && data[i].program.title ? "<h4 class=\'program\'><a href=\'/program/" + data[i].program.slug + "/\'>" + data[i].program.title.toUpperCase() + "</a></h4>" : ""',
                episode_title: 'data[i].title ? \'<h3 class="title"><a href="/video/\' + data[i].contentID + \'/">\' + data[i].title + "</a></h3>" : ""',
                episode_description: 'data[i].short_description ? data[i].short_description.replace(/(<([^>]+)>)/ig, "") : "&nbsp;"',
                episode_duration: 'data[i].duration.toHHMMSS()',
                watchlist_status: '(favorite_video_ids.indexOf(data[i].contentID.toString()) > -1) ? "minus" : "plus"',
                producer: 'data[i].program && data[i].program.common_name ? \'<div class="producer">\' + data[i].program.common_name + "</div>" : ""'
            },
            programsMapping = {
                slug: 'data[i].slug ? data[i].slug: ""',
                data: 'data[i].stack ? PBS.ResponsiveImages.mark({0: 480, 480: 256}) : ""',
                poster: 'data[i].stack ? PBS.ResponsiveImages.getResizedSrc(data[i].stack) : NO_IMAGE',
                title: 'data[i].title ? data[i].title : ""'
            };

        return {
            getVideoTag : getVideoTag,
            loadMoreItems : loadMoreItems,
            onImageFallback: onImageFallback,
            onLogoFallback: onLogoFallback,
            templates: {
                videoList : '<li class="videoItem">\
                                <div class="watchlist">\
                                    <a href="#" data-videoid="{contentID}"><span class="nav-icon {watchlist_status}"></span></a>\
                                </div>\
                                <div class="programTitle">\
                                    {program_title}\
                                    {episode_title}\
                                </div>\
                                <a class="image" href="/video/{contentID}/">\
                                    <img {data} src="{poster}" alt="" data-fallback-src="{pbs_logo}" onerror=PBS.Content.onImageFallback(this) />\
                                    {expiration_info}\
                                </a>\
                                <p class="description">{episode_description}</p>\
                                <p class="duration">{episode_duration}</p>\
                            </li>'
            },
            mappings: {
                defaultMapping: defaultMapping,
                programsMapping: programsMapping
            }
        };
    }());

    Number.prototype.toHHMMSS = function(showHours) {
        var sec_num = parseInt(this, 10),
            hours   = Math.floor(sec_num / 3600),
            minutes = Math.floor((sec_num - (hours * 3600)) / 60),
            seconds = sec_num - (hours * 3600) - (minutes * 60),
            time;

        if (hours   < 10) { hours   = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        time = showHours ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds;
        return time;
    };
}(window, jQuery));

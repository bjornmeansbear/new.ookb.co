(function(window,$){"use strict";if(!window.PBS){window.PBS={};}
PBS.Content=(function(){function renderTemplate(template,mapping,list,data){var htmlData='',i,key,itemHtml;if(data&&data.length){for(i in data){if(Object.prototype.hasOwnProperty.call(data,i)){itemHtml=template;for(key in mapping){if(Object.prototype.hasOwnProperty.call(mapping,key)){itemHtml=itemHtml.replace(new RegExp('{'+key+'}','gi'),eval(mapping[key]));}}
htmlData+=itemHtml;}}}else if(!list.children(':not(#loadMore)').length){htmlData+='<li id="noItems">There are no items to be displayed.</li>';}
return htmlData;}
function appendToListContent(template,mapping,list,data){list.append(renderTemplate(template,mapping,list,data));}
function displayListContent(template,mapping,list,data){var children=list.children(':not(#loadMore)');if(!children.length){children.remove();list.prepend(renderTemplate(template,mapping,list,data));}}
function checkEOL(list,data,count){if(data.length<count){list.find('#loadMore').remove();}}
function refreshList(list,count){var loadMoreAnchor=list.find('#loadMore'),listSize,href;if(loadMoreAnchor.length){listSize=parseInt(list.find('li').length,10)-1;href=loadMoreAnchor.find('a').attr('href').replace(/start\/[\d\.]+/g,"start/"+listSize).replace(/end\/[\d\.]+/g,"end/"+(listSize+count));loadMoreAnchor.find('a').attr('href',href);if(list.find('li:last').attr('id')!=='loadMore'){list.find('#loadMore').insertAfter(list.find('li:last'));}}}
function getVideoTag(src){switch(src){case'#previews':return'previews';case'#shorts':return'shorts'; default:return'episodes';}}
function loadMoreItems(url,container,template,mapping,append,callback){var count=PBS.MobileWeb.ITEMS_PER_PAGE;container.append($("<li id='loading' />"));container.find('#loadMore').hide();$.ajax({url:url,headers:CUSTOM_HEADERS,success:function(data){container.find('#loading').remove();container.find('#loadMore').show();checkEOL(container,data,count);if(append){appendToListContent(template,mapping,container,data);}else{displayListContent(template,mapping,container,data);}
refreshList(container,count);PBS.MobileWeb.videoListsConfig();if($.isFunction(callback)){callback();}}});}
function loadMoreItemsJSON(data,container,template,mapping,append,callback){var count=PBS.MobileWeb.ITEMS_PER_PAGE,i;container.append($("<li id='loading' />"));for(i=0;i<data.length;i+=1){appendToListContent(template,mapping,container,data[i]);if(append){appendToListContent(template,mapping,container,data);}else{displayListContent(template,mapping,container,data);}}
refreshList(container,count);PBS.MobileWeb.videoListsConfig();if($.isFunction(callback)){callback();}}
function onImageFallback(image,isSquare){var parent=image.parentNode,newElType='span',newEl; var $image=$(image),$parent=$(parent);if($image.hasClass('programlogo')){return parent.removeChild(image);}
if(image.id==='programLogo'){newElType='h2';}
newEl=document.createElement(newElType);switch(newElType){case'span':if(isSquare){newEl.className='imageFallbackSquare';}else{newEl.className='imageFallbackWide';}
$parent.addClass('imageFallback');break;case'h2':newEl.id='programTitle';newEl.innerHTML=image.alt;parent.removeChild(image);break;}
parent.insertBefore(newEl,parent.firstChild);}
function onLogoFallback(image){image.style.display="none";$(".stationTextOnError").addClass("showText");}
function getExpireDateLabel(expire_date){var one_day=1000*60*60*24,now=new Date(),current_date=new Date(now.getFullYear(),now.getMonth(),now.getDate()),expiring=expire_date.split('/'),expiring_date=new Date(expiring[2],expiring[0]-1,expiring[1]),no_of_days=(expiring_date-current_date)/one_day;if(0<=no_of_days<=9){if(no_of_days===0){return"Today";}
if(no_of_days===1){return"Tomorrow";}
return"in "+no_of_days+" Days";}
return"on "+expire_date;}
var NO_IMAGE=STATIC_URL+'img/no_image_480_270.jpg',PBS_LOGO=STATIC_URL+'img/generic_logo_480_270.jpg',defaultMapping={contentID:'data[i].contentID',slug:'data[i].slug ? data[i].slug: ""',data:'data[i].poster_url ? PBS.ResponsiveImages.mark({0: 480, 256: 256}) : ""',poster:'data[i].poster_url ? PBS.ResponsiveImages.getResizedSrc(data[i].poster_url) : NO_IMAGE',pbs_logo:'PBS_LOGO',expiration_info:'data[i].expiredate && data[i].expiring_soon ? \'<span class="expiring">Expires \' + getExpireDateLabel(data[i].expiredate) + "</span>" : ""',program_title:'data[i].program && data[i].program.title ? "<h4 class=\'program\'><a href=\'/program/" + data[i].program.slug + "/\'>" + data[i].program.title.toUpperCase() + "</a></h4>" : ""',episode_title:'data[i].title ? \'<h3 class="title"><a href="/video/\' + data[i].contentID + \'/">\' + data[i].title + "</a></h3>" : ""',episode_description:'data[i].short_description ? data[i].short_description.replace(/(<([^>]+)>)/ig, "") : "&nbsp;"',episode_duration:'data[i].duration.toHHMMSS()',watchlist_status:'(favorite_video_ids.indexOf(data[i].contentID.toString()) > -1) ? "minus" : "plus"',producer:'data[i].program && data[i].program.common_name ? \'<div class="producer">\' + data[i].program.common_name + "</div>" : ""'},programsMapping={slug:'data[i].slug ? data[i].slug: ""',data:'data[i].stack ? PBS.ResponsiveImages.mark({0: 480, 480: 256}) : ""',poster:'data[i].stack ? PBS.ResponsiveImages.getResizedSrc(data[i].stack) : NO_IMAGE',title:'data[i].title ? data[i].title : ""'};return{getVideoTag:getVideoTag,loadMoreItems:loadMoreItems,onImageFallback:onImageFallback,onLogoFallback:onLogoFallback,templates:{videoList:'<li class="videoItem">\
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
                            </li>'},mappings:{defaultMapping:defaultMapping,programsMapping:programsMapping}};}());Number.prototype.toHHMMSS=function(showHours){var sec_num=parseInt(this,10),hours=Math.floor(sec_num/3600),minutes=Math.floor((sec_num-(hours*3600))/60),seconds=sec_num-(hours*3600)-(minutes*60),time;if(hours<10){hours="0"+hours;}
if(minutes<10){minutes="0"+minutes;}
if(seconds<10){seconds="0"+seconds;}
time=showHours?hours+':'+minutes+':'+seconds:minutes+':'+seconds;return time;};}(window,jQuery));(function(window){'use strict';window.PBS=window.PBS||{};var comScoreId=3005420,streamSense=new ns_.StreamSense({},'http://b.scorecardresearch.com/p?c1=2&c2='+comScoreId);PBS.comScore=(function(){var defaults={ns_st_cn:'', ns_st_ci:'0', ns_st_pu:'PBS', ns_st_pr:'', ns_st_ep:'', ns_st_pn:'0',ns_st_tp:'0',ns_st_cl:'',ns_st_cu:'none', ns_st_ct:'vc12', c3:'*null', c4:'7197999', c6:'*null'},clips,endings,currentClipIndex,PLAYER,SETTINGS,VIDEOINFO,ADVERTISING;function parseDuration(seconds,toString){if(toString){return''+(seconds*1000);}
return seconds*1000;}
function generateClips(){var clip=[],matrix=getClipMatrix(),clips=matrix.clips,segments=matrix.segments,order=matrix.order,endings=matrix.endings,total=order.length,segment=1,data,i;if(clips>1){for(i=0;i<total;i++){extend(clip[i]={},defaults);clip[i].ns_st_cn=''+(i+1);switch(order[i]){case'pre':data=setSegmentData(segment,segments,0);clip[i].ns_st_ct='va11';break;case'segment':data=setSegmentData(segment++,segments);clip[i].ns_st_ct='vc12';break;case'mid':data=setSegmentData(segment,segments,0);clip[i].ns_st_ct='va12';break;}
extend(clip[i],data);}
}else{extend(clip[0]={},defaults);data=setSegmentData(1,1);extend(clip[0],data);clip[0].ns_st_cn='1';}
return{clip:clip,endings:endings};}
function setSegmentData(current,of,duration){var obj={};duration=typeof duration!=='undefined'?duration:VIDEOINFO.duration;obj.ns_st_ci=''+SETTINGS.videoId;obj.ns_st_pr=VIDEOINFO.program.title;obj.ns_st_ep=VIDEOINFO.title;obj.ns_st_pn=''+current++;obj.ns_st_tp=''+of;obj.ns_st_cl=parseDuration(duration,true);obj.ns_st_cu=location.href||'none';if(duration>0&&duration<10*60){obj.ns_st_ct='vc11';}
return obj;}
function getADs(ads){if(!ads){throw'[comScore getADs]: ads object is undefiened';}
return Object.keys(ads);}
function getAdCount(ads){if(!ads){throw'[comScore getAdCount]: ads object is undefiened';}
return getADs(ads).length;}
function isSecondAdInDoubleMidroll(index){return clips[index].ns_st_ct==='va12'&&clips[index-1].ns_st_ct==='va12';}
function getClipMatrix(){var clips=1,segments=1,pos=0,ads=ADVERTISING.schedule,adCount=getAdCount(ads),endings=[],order=[];if(adCount){clips+=adCount;order[pos++]='pre';order[pos++]='segment';if(adCount>1){endings=setSegmentEndings(ads);order[pos++]='mid';if(adCount>2){if(!SETTINGS.doubleMidroll){order[pos++]='segment';segments+=1;}
order[pos++]='mid';order[pos++]='segment';segments+=1;}
if(adCount>3){order[pos++]='mid';order[pos++]='segment';segments+=1;}}}
return{clips:clips,segments:segments,ads:adCount,order:order,endings:endings};}
function setSegmentEndings(ads){var endings=[],clip=0,key,offset;for(key in ads){offset=ads[key].offset;if(isNumeric(offset)&&!~endings.indexOf(offset)){endings[clip++]=offset;}
clip++;}
return endings;}
function getClipIndexForPosition(data){var offset=data.offset,n=endings.length,clipsLength=clips.length,i;if(clipsLength===1){return 1;} 
if(clipsLength===2){return clips.length-1;}
if(offset>endings[n-1]){return clips.length-1;}
for(i=0;i<n;i++){if(endings[i]&&endings[i]>offset){return i;}}
console.error('[comsScore getClipIndexForPosition] offset '+offset+' unavailable.');return clipsLength-1;}
function setClip(index){streamSense.setClip(clips[index]);}
function initClips(){var data=generateClips();clips=data.clip;endings=data.endings;currentClipIndex=0;streamSense.setPlaylist();setClip(currentClipIndex);}
function bindPlayerEvents(){PLAYER.onAdImpression(function(){onAdImpression();});PLAYER.onAdComplete(function(){onAdComplete();});PLAYER.onAdError(function(){onAdError();});if(PLAYER.hasOwnProperty('onAdPause')){PLAYER.onAdPause(function(){notify('PAUSE');});}
if(PLAYER.hasOwnProperty('onAdPlay')){PLAYER.onAdPlay(function(){notify('PLAY');});}
PLAYER.onBuffer(function(){onBuffer();});PLAYER.onPlay(function(){onPlay();});PLAYER.onPause(function(event){onPause(event);});PLAYER.onSeek(function(event){onSeek(event);});PLAYER.onComplete(function(){notify('END');});}
function onAdImpression(){if(currentClipIndex!==0){if(!isSecondAdInDoubleMidroll(currentClipIndex)){currentClipIndex+=1;notify('END');setClip(currentClipIndex);}}
}
function onAdComplete(){notify('END');currentClipIndex+=1;setClip(currentClipIndex);}
function onAdError(){if(currentClipIndex===1&&SETTINGS.doubleMidroll){currentClipIndex+=1;}
if(SETTINGS.doubleMidroll&&currentClipIndex>3){currentClipIndex+=1;}
onAdComplete();}
function onBuffer(){notify('BUFFER');}
function onPlay(){notify('PLAY');}
function onPause(state){if(state.oldstate!=='BUFFERING'){notify('PAUSE');}}
function onSeek(time){var index=getClipIndexForPosition(time);if(index!==currentClipIndex){notify('END');setClip(index);}}
function notify(event){var position=0;if(typeof PLAYER!=='undefined'){if(PLAYER.hasOwnProperty('getPosition')){position=PLAYER.getPosition();}
streamSense.notify(ns_.StreamSense.PlayerEvents[event.toUpperCase()],{},parseDuration(position));}}
function extend(obj,source){for(var prop in source){obj[prop]=source[prop];}}
function isNumeric(n){return!(n instanceof Array)&&n-parseFloat(n)>=0;}
function init(config){PLAYER=config.player;SETTINGS=config.settings;VIDEOINFO=config.videoInfo;ADVERTISING=config.advertising||{'schedule':{}};defaults={ns_st_cn:'', ns_st_ci:'0', ns_st_pu:'PBS', ns_st_pr:'', ns_st_ep:'', ns_st_pn:'0',ns_st_tp:'0',ns_st_cl:'',ns_st_cu:'none', ns_st_ct:'vc12', c3:'*null', c4:'7197999', c6:'*null'};clips;endings;currentClipIndex;if(!ns_){throw'ns_ comScore variable is not found';}
if(!streamSense){throw'streamSense comScore variable is not found';}
initClips();bindPlayerEvents();}
return{init:init,notify:notify};}());}(window));"use strict";if(!window.PBS){window.PBS={};}
PBS.videoInfos=function(id){var vidInfo={},dataSource=window.location.protocol+'//'+window.location.hostname+
(window.location.port?':'+window.location.port:'')+'/',vidUrl,hasFlash=PBS.Helper.detectFlash(),vidEncoding;function showError(code){var message="Error occured.";switch(code){case 403:message="We're sorry, but this video is not available "+"in your region due to right restrictions.";break;case 101:$("#buttonsShare").hide();message="We're sorry, but this video is not yet available.";break;case 404: $(".embedBtn").hide();message="We are experiencing technical difficulties that are "+"preventing us from playing the video at this time. "+"Please check back again soon.";break;case 410:$("#buttonsShare").hide();message="This video has expired and is no longer "+"available for online streaming.";break;default:message="We're experiencing technical difficulties that are "+"preventing us from playing the video at this time. "+"Please try to reload the page.";break;}
$("#player").addClass("ursError").html("<p class='ursMessage'>"+message+"</p>"); if(document.querySelector('#playlistHandler')){$("#player p").append("<span></br>You will be redirected to the next video.</span>");if(playlistDirectionForward){setTimeout(function(){PBS.User.playNextInPlaylist();},3000);}else{setTimeout(function(){PBS.User.playPrevInPlaylist();},3000);}}} 
function makeURSRequest(ursUrl){ursUrl+="?format=jsonp";$.ajax({url:ursUrl,dataType:"jsonp"}).done(function(response){if(response.status!=="error"){vidUrl=response.url;}else{showError(response.http_code);}
PBS.jwPlayer.setVideoData(vidUrl,vidInfo,vidEncoding);});} 
function manageLoadingBar(state){if(state==="create"){if($("#loadingbar").length===0){$("body").append("<div id='loadingbar'></div>");$("#loadingbar").addClass("waiting").append($("<dt/><dd/>"));$("#loadingbar").width((50+Math.random()*30)+"%");}}else if(state==="remove"){$("#loadingbar").width("101%").delay(200).fadeOut(400,function(){$(this).remove();});}}
$.ajax({url:dataSource+"videoInfo/"+id+"/",data:{format:"jsonp",type:jwSettings.playerType},type:"GET",dataType:"jsonp",jsonpCallback:"video_info",beforeSend:function(){if(jwSettings.playerType==="portal"){manageLoadingBar("create");}}}).always(function(){if(jwSettings.playerType==="portal"){manageLoadingBar("remove");}}).done(function(data){var streamType="alternate_encoding";if(hasFlash||PBS.Helper.detectIos()){streamType="recommended_encoding";}
vidEncoding=data[streamType].eeid;vidInfo=data; if(vidInfo.program.slug){PBS.jwPlayer.loadAditionalContent(vidInfo.program.slug);}
if(data.not_yet_available){showError(101);}else{ if(data[streamType].hasOwnProperty('url')){makeURSRequest(data[streamType].url);}else{showError(404);}}}).fail(function(){console.error("ERROR CALLING VIDEO INFO");showError();});};if(!window.PBS){window.PBS={};}
PBS.jwAnalitycs=(function(){"use strict";var GAPlayerCat="",GAMvodStr="",GALocationStr="",PLAYER,program,title,videoId,videoDuration,playerType,playerTrack,startTime,GALocationStr,currentEncoding,GADurationCat="Duration Viewed",GAQuartileCat="Quartile viewed",runOnce=true,currentDurationViewed="",currentQuartile="",lowestQuality,dropQualityTime=15,dropQuality=false,dropQualityMessage="We noticed you are"+" having network connectivity issues so we automatically"+" adjusted the quality of your video to provide you with"+" a better streaming experience.",parentUrl=document.referrer,qualityLevels=[],extra={},startBuffer=0,bandwidth=null,seeked=false,isQualityAuto=false,manuallyChanged=false,bufferInterval=[],isHLS=false,initBuffer,isMvod=false,quartileValues=[24,49,74,100],quartileLabels=["Quartile 0-24%","Quartile 25-49%","Quartile 50-74%","Quartile 75%-100%"],durationValues=[5,60,300,600,1200,1800,2400,3000,3600,4200,4800,5400,6000,6600,7200,7800,8400,9000,9600,10200,10800,11400,12000,12600,13200,13800,14400,15000,15600,16200,16800],durationLabels=["00:00:00 - 00:00:05","00:00:05 - 00:01:00","00:01:00 - 00:05:00","00:05:00 - 00:10:00","00:10:00 - 00:20:00","00:20:00 - 00:30:00","00:30:00 - 00:40:00","00:40:00 - 00:50:00","00:50:00 - 00:60:00","00:60:00 - 01:10:00","01:10:00 - 01:20:00","01:20:00 - 01:30:00","01:30:00 - 01:40:00","01:40:00 - 01:50:00","01:50:00 - 02:00:00","02:00:00 - 02:10:00","02:10:00 - 02:20:00","02:20:00 - 02:30:00","02:30:00 - 02:40:00","02:40:00 - 02:50:00","02:50:00 - 03:00:00","03:00:00 - 03:10:00","03:10:00 - 03:20:00","03:20:00 - 03:30:00","03:30:00 - 03:40:00","03:40:00 - 03:50:00","03:50:00 - 04:00:00","04:00:00 - 04:10:00","04:10:00 - 04:20:00","04:20:00 - 04:30:00","04:30:00+"],previousLevel,currentLevel,firstMeta=true;function getCurrentPosition(){return parseInt(PLAYER.getPosition(),10);} 
function showNotification(message,timeout){var notification=$("<div></div>"),paragraph=$("<p></p>"),closeBtn=$("<a href=''>&times;</a>");paragraph.html(message);notification.append(paragraph);notification.append(closeBtn);notification.css({'position':'absolute','top':'0px','left':'0px','padding':'15px','background-color':'rgba(0,0,0,0.7)','width':'100%','line-height':'1.4em'});paragraph.css({'float':'left','font-weight':'bold','line-height':'1.375em','width':'95%'});closeBtn.css({'float':'right','font-weight':'bold','font-size':'2em','line-height':'0.5em','color':'#fff'});$("#frame").append(notification);closeBtn.on('click',function(){notification.remove();return false;});setTimeout(function(){notification.remove();},(timeout*1000));} 
function getLowestQualityIndex(){var key,lowest=999999999,index,prop=isHLS?'bitrate':'height';for(key in qualityLevels){if(qualityLevels.hasOwnProperty(key)){if(qualityLevels[key].hasOwnProperty(prop)){lowest=Math.min(lowest,qualityLevels[key][prop]);if(qualityLevels[key][prop]===lowest){index=key;}}}}
lowestQuality=index;return index;}
function onQualityChangeHandler(event){var qualityChangedTo=qualityLevels[event.currentQuality];manuallyChanged=true; if(qualityChangedTo.label==="Auto"){isQualityAuto=true;}else{isQualityAuto=false;}} 
function changeVideoQuality(switchTo){var currentQuality=PLAYER.getCurrentQuality();switchTo=parseInt(switchTo,10);if(switchTo){if(currentQuality!==switchTo){PLAYER.setCurrentQuality(switchTo);showNotification(dropQualityMessage,10); PBS.jwGoonhilly.logGoonHilly("Information","WeGaveUp","MediaQualityChangedProgrammatically",getCurrentPosition());}}}
function clearBufferingInterval(){for(var i=0;i<bufferInterval.length;i++){clearInterval(bufferInterval[i]);}
if(dropQuality){ if(qualityLevels.length>1){changeVideoQuality(lowestQuality||getLowestQualityIndex());}
dropQuality=false;}} 
function getBufferLength(state){var counter=0,endBuffer,buffer=Math.floor((Math.random()*100)+1);switch(state){case"start":startBuffer=0;startBuffer=new Date().getTime();bufferInterval[buffer]=setInterval(function(){counter++;if(counter===dropQualityTime){dropQuality=true;clearBufferingInterval();}},1000);break;case"end":clearBufferingInterval();endBuffer=new Date().getTime()-startBuffer;break;}
return endBuffer;}
function getQuartilePlayed(percentPlayed){var selected=-1,i,total=quartileValues.length;for(i=0;i<total;i+=1){if(percentPlayed<quartileValues[i]){selected=i;break;}}
if(selected===-1){selected=quartileValues.length-1;}
if(currentQuartile!==selected){PBS.GA.trackEvent(GAQuartileCat,playerTrack,quartileLabels[selected]);}
currentQuartile=selected;}
function getDurationPlayed(secondsPlayed){var selected=-1,i,total=durationValues.length;for(i=0;i<total;i+=1){if(secondsPlayed<durationValues[i]){selected=i;break;}}
if(selected===-1){selected=durationValues.length-1;}
if(currentDurationViewed!==selected){PBS.GA.trackEvent(GADurationCat,playerTrack,durationLabels[selected]);}
currentDurationViewed=selected;}
function completeHandler(timeAtComplete){PBS.GA.trackEvent(GAPlayerCat,'MediaComplete',playerTrack);PBS.jwGoonhilly.logGoonHilly("Information","Finished playback","MediaCompleted",timeAtComplete);if(playerType!=="portal"){PBS.jwIframePlayer.makeActive('.viralEndScreen');} 
if($.cookie('pbs_si')){
 PBS.Profile.watchedVideos.add(videoId,videoDuration);if(playerType==="portal"){if(document.querySelector('#playlistHandler')){PBS.User.playNextInPlaylist();}}}else{PBS.MobileWeb.toggleEndHdMessage("show");}
$(window).off('beforeunload');}
function onPlayHandler(event){var bufferType; if(runOnce){extra={x_flash_player:PBS.Helper.detectFlash()};PBS.GA.trackEvent(GAPlayerCat,'MediaStart',playerTrack);if(playerType==='viral'){PBS.GA.trackEvent('Viral Instances',parentUrl,playerTrack);}
if(playerType==='partner'){PBS.GA.trackEvent('Partner Instances',parentUrl,playerTrack);}
PBS.jwGoonhilly.logGoonHilly("Information","Video play button pressed","MediaStarted",getCurrentPosition(),extra); $(window).on('beforeunload',onLeaveHandler);runOnce=false;}else{PBS.jwGoonhilly.logGoonHilly("Information","Video play button pressed","MediaStarted",getCurrentPosition());}
if(event.oldstate==="BUFFERING"){extra={x_buffering_length:getBufferLength("end"),x_encoding_name:currentEncoding,x_auto:isQualityAuto,x_bandwidth:bandwidth,x_after_seek:seeked,x_start_time:startTime};if(currentLevel){extra.x_stream_size=currentLevel.replace("kbps","");}else{extra.x_stream_size=currentLevel;}
if(seeked){seeked=false;}
if(initBuffer){bufferType="MediaInitialBufferEnd";}else{bufferType="MediaBufferingEnd";}
PBS.jwGoonhilly.logGoonHilly("Information","Buffering ended",bufferType,getCurrentPosition(),extra);}}
function onPauseHandler(){var currentTime=getCurrentPosition();PBS.jwGoonhilly.logGoonHilly("Information","Video paused","MediaEnded",currentTime); getDurationPlayed(currentTime); if($.cookie('pbs_si')){PBS.Profile.watchedVideos.add(videoId,currentTime);}} 
function onMetaHandler(event){var extra={};if(Object.prototype.hasOwnProperty.call(event.metadata,'currentLevel')){var currentStream=event.metadata.currentLevel.substring(8,event.metadata.currentLevel.indexOf(","));if(currentLevel===undefined||currentLevel!==currentStream){if(previousLevel!==currentLevel){previousLevel=currentLevel;}
currentLevel=currentStream;if(manuallyChanged){manuallyChanged=false;if(previousLevel){extra.x_previous_quality=previousLevel;}
extra.x_new_quality=currentLevel;PBS.jwGoonhilly.logGoonHilly("Information",currentLevel,"MediaQualityChange",getCurrentPosition(),extra);}else{bandwidth=(event.metadata.bandwidth/8);extra={x_encoding_name:currentEncoding,x_stream_size:(currentLevel?currentLevel.replace("kbps",""):currentLevel),x_auto:isQualityAuto,x_bandwidth:bandwidth};if(previousLevel){extra.x_previous_quality=previousLevel;}
if(!firstMeta){extra.x_new_quality=currentLevel;}
firstMeta=false;PBS.jwGoonhilly.logGoonHilly("Information",currentLevel,"MediaQualityChangeAuto",getCurrentPosition(),extra);}}}}
function onBufferHandler(event){var bufferType;if(event.oldstate==='IDLE'){bufferType="MediaInitialBufferStart";initBuffer=false;}else{bufferType="MediaBufferingStart";}
PBS.jwGoonhilly.logGoonHilly("Information","Buffering started",bufferType,getCurrentPosition());getBufferLength("start","bufferStart");}
function onQualityLevelsHandler(event){qualityLevels=event.levels; if(event.currentQuality===0){isQualityAuto=true;}else{isQualityAuto=false;}}
function onSeekHandler(event){PBS.jwGoonhilly.logGoonHilly("Information",event.offset,"MediaScrub",getCurrentPosition());seeked=true;}
function onTimeHandler(event){var currentTime=parseInt(event.position,10),duration=event.duration,percentViewed=parseInt((currentTime*100)/duration,10);getQuartilePlayed(percentViewed);}
function onLeaveHandler(){PBS.jwGoonhilly.logGoonHilly("Information","Video page closed","MediaEnded",getCurrentPosition());} 
function setHandlers(){ PLAYER.onReady(function(){PBS.GA.trackEvent(GAPlayerCat,'MediaLoad',playerTrack);}); PLAYER.onPlay(function(event){onPlayHandler(event);}); PLAYER.onPause(function(){onPauseHandler();}); PLAYER.onComplete(function(){completeHandler(getCurrentPosition());}); PLAYER.onQualityLevels(function(event){onQualityLevelsHandler(event);}); PLAYER.onQualityChange(function(event){onQualityChangeHandler(event);}); PLAYER.onAdImpression(function(event){getBufferLength("end");PBS.jwGoonhilly.logGoonHilly("Information","Ad "+event.adtitle+"has Started","AdStarted",getCurrentPosition());});if(PLAYER.hasOwnProperty('onAdPause')){PLAYER.onAdPause(function(){PBS.jwGoonhilly.logGoonHilly("Information","Ad has Paused","AdEnded",getCurrentPosition());});}
if(typeof PLAYER.onAdComplete==='function'){

 PLAYER.onAdComplete(function(){PBS.jwGoonhilly.logGoonHilly("Information","Ad has Completed","AdCompleted",getCurrentPosition());});}
if(PLAYER.hasOwnProperty('onAdPlay')){PLAYER.onAdPlay(function(){PBS.jwGoonhilly.logGoonHilly("Information","Ad Playing possibly after resume","AdPlay",getCurrentPosition());});} 
PLAYER.onAdError(function(callback){PBS.jwGoonhilly.logGoonHilly("Error",callback.code+" | "+
callback.message+" | "+
callback.tag,"AdFailed",getCurrentPosition());}); PLAYER.onBuffer(function(event){onBufferHandler(event);}); PLAYER.onSeek(function(event){onSeekHandler(event);}); PLAYER.onMeta(function(event){onMetaHandler(event);}); PLAYER.onError(function(){PBS.jwGoonhilly.logGoonHilly("Error","Video playback error","MediaFailed",getCurrentPosition());}); PLAYER.onTime(function(event){onTimeHandler(event);});} 
function init(config){PLAYER=jwplayer();program=config.program;title=config.title;videoId=config.id;videoDuration=config.duration;playerType=config.playerType;playerTrack=program+" | "+title+" | "+videoId;startTime=config.startTime;currentEncoding=config.encoding;isMvod=config.mvod||false;runOnce=true;initBuffer=true;lowestQuality=undefined;GAMvodStr="";GALocationStr="";clearInterval(bufferInterval);switch(playerType){case'viral':GAPlayerCat='Viral Player';break;case'partner':GAPlayerCat='Partner Player';break;default:GAPlayerCat='Portal';if(is_national){GALocationStr="National ";}
else{GALocationStr="Local ";}
break;}
if(isMvod){GAMvodStr="PLUS ";}
GAPlayerCat='Video - '+GALocationStr+GAMvodStr+GAPlayerCat;if(currentEncoding.indexOf("hls")!==-1){isHLS=true;}
if(PLAYER){setHandlers();}}
return{init:init,completeHandler:completeHandler};}());if(!window.PBS){window.PBS={};}
PBS.jwPlayer=(function(){"use strict";var PLAYERID,PLAYERTYPE,SETTINGS,ISFINISHED,ENCODING,POSTER,CC,PLAYINFOS,LIVERAILINFO,VIDEOURL,VIDEOID,CURRENTURL,RUNPREROLL,LASTPOS,PROGRAMSLUG,INFO,ADSCHEDULE,LOCATION,PRODUCER,RUNONCE=true,DFPSCHEDULE,HELPER;function isFinished(){return ISFINISHED;}
function seekTo(time){if(SETTINGS.playerType!=='portal'){jwplayer().pause();}
setTimeout(function(){jwplayer().seek(time);},0);}
function playBetween(min,max,lastPosition){var seeking=false,runOnce=true,player=jwplayer();if(max>0){player.onSeek(function(event){if(!seeking){if(event.offset>=max){seeking=true;seekTo(event.position);}
if(event.offset<min||event.offset===undefined){if(SETTINGS.playerType!=='portal'){seeking=true;seekTo(event.position);}}}else{seeking=false;}});player.onTime(function(event){ if(lastPosition<min){lastPosition=min;}
if(lastPosition||(min>0&&min!==max)){if(parseInt(event.position,10)===0){if(runOnce){if(lastPosition){seekTo(lastPosition);}else{seekTo(min);}
runOnce=false;}}} 
if(parseInt(event.position,10)>=max){if(PLAYERTYPE!=='portal'){player.stop();PBS.jwAnalitycs.completeHandler(max);player.setFullscreen(false);PBS.comScore.notify('END');ISFINISHED=true;}}});}} 
function viralIntervals(chapters,duration){var currentChapter=HELPER.getUrlVar('chapter'),chapter=chapters[parseInt(currentChapter,10)-1],chapterStart,chapterEnd,chapterLength,chapterDuration,start,end; if(!currentChapter){start=0;if(duration&&duration<SETTINGS.maxViralPosition){end=duration;}else{end=SETTINGS.maxViralPosition;}} 
if(chapter){chapterStart=parseInt(chapter.start_time/1000,10);chapterDuration=parseInt(chapter.duration,10)/1000;chapterEnd=chapterStart+chapterDuration;chapterLength=chapterEnd-chapterStart;if(chapterLength>SETTINGS.maxViralPosition){chapterEnd=chapterStart+SETTINGS.maxViralPosition;}
start=chapterStart;end=chapterEnd-1;}
return{start:start,end:end};}
function getCurrentPosition(){return parseInt(jwplayer().getPosition(),10);}
function getPlayableParams(videoInfo){var start=0,end=videoInfo.duration,viralParams,wachedBefore=($.cookie('pbs_si')?PBS.Profile.watchedVideos.get(VIDEOID):false);switch(SETTINGS.playerType){case'viral':viralParams=viralIntervals(videoInfo.chapters,videoInfo.duration);start=viralParams.start;end=viralParams.end;break;case'partner':start=parseInt(HELPER.getUrlVar('start'),10)||start;end=parseInt(HELPER.getUrlVar('end'),10)||end;break;default:start=parseInt(HELPER.getUrlVar('start'),10)||(wachedBefore?wachedBefore.timecode_i:0)||0;if(start===end){start=0;}
break;}
return{start:start,end:end,duration:end-start};}
function getCCSettings(){ if($.cookie('ccSettings')){return JSON.parse($.cookie('ccSettings'));}} 
function showCCsettings(player){player.addButton(STATIC_URL+'img/cc_settings.png','Closed Captions Settings',function(){var win;

 LASTPOS=getCurrentPosition(); $.cookie("lastposition",LASTPOS,{expires:356,path:'/',domain:COOKIE_DOMAIN}); if(player.getFullscreen()){player.setFullscreen(false);} 
if(player.getState()==='PLAYING'){player.pause();}
if($(window).width()>=1024){PBS.jwCCSettings.show();}else{win=window.open('/captions-settings.html','_blank');win.focus();}},'ccSettings');}
function runAnalitycs(info){ PBS.jwAnalitycs.init({encoding:ENCODING,duration:info.duration,startTime:PLAYINFOS.start,id:info.contentID,title:info.title,program:info.program.title,playerType:PLAYERTYPE,mvod:info.mvod.is_mvod}); PBS.jwGoonhilly.setVideoData({id:info.contentID,title:info.title,program:info.program.title,duration:info.duration,producer:info.program.producer,playerType:PLAYERTYPE}); PBS.comScore.init({player:jwplayer(),settings:SETTINGS,videoInfo:INFO,advertising:DFPSCHEDULE});}
function createPlayer(url){var player,getSmil=$.cookie('pbs_si')||(PLAYERTYPE==='partner'),videoFile=url,hasAutoplay=false,startPos=PLAYINFOS.start;hasAutoplay=HELPER.getUrlVar('autoplay');
player=jwplayer(PLAYERID).setup({width:'100%',aspectratio:'16:10',stagevideo:false,skin:'http://dun96pyxwe2yl.cloudfront.net'+'/lib/jwplayer/glow.xml',autostart:hasAutoplay,analytics:{enabled:false,cookies:false},playlist:[{image:POSTER,sources:[{file:videoFile}],captions:[{file:CC,label:'English'}]}],captions:getCCSettings(),primary:'flash',advertising:DFPSCHEDULE});if(INFO){runAnalitycs(INFO);} 
if(CC&&is_desktop){player.onCaptionsList(showCCsettings(player));}
if(LASTPOS||PLAYINFOS.duration!==INFO.duration){playBetween(startPos,PLAYINFOS.end,LASTPOS);}
if(SETTINGS.playerType!=='portal'){PBS.jwIframePlayer.init(INFO,player);}
if(SETTINGS.playerType==='partner'){PBS.jwMessageAPI.init(INFO,player);} 
if(document.querySelector('#playlistHandler')){player.onComplete(function(){if(redirectAtEndOfPlaylist){ if(document.querySelector('#playlistHandler')){window.location.href="/watchlist/";}}});}}
function getVideoPoster(image){var poster=image,its_prefix=poster.search('http://image.pbs.org/');if(its_prefix===-1){poster=poster.replace('http://','http://image.pbs.org/merlin/');}
poster=poster.replace('.jpg','.jpg.fit.980x551.jpg');return poster;}
function loadAditionalContent(program){ $('#aditionalContent').append($('<li id="loading"></li>'));$.ajax({type:'GET',url:'/video/'+VIDEOID+'/related/',data:{program_slug:program},success:function(data){ $('#aditionalContent').html(data);setTimeout(function(){PBS.User.processFavoriteVideosData();},1000);}});}
function managePageUnload(){var currentTime=getCurrentPosition();$(window).off('beforeunload');if(currentTime>0&&currentTime<PLAYINFOS.end){ PBS.jwGoonhilly.logGoonHilly("Information","Video page closed","MediaEnded",currentTime);}}
function hmsToSecond(time){var timeArray=time.split(':'),seconds=(+timeArray[0])*60*60+
(+timeArray[1])*60+(+timeArray[2]);return seconds;}
function dfpToAdSchedule(dpf,duration,start){var json=$.xml2json(dpf),schedule={},adConfig={},vmap={};DFPSCHEDULE={};adConfig.client='vast';adConfig.admessage='A message from our sponsors.';adConfig.admessage+='Your video will begin in XX sec.';adConfig.cuetext="Sponsor Message"; if(PLAYERTYPE==='portal'&&$(window).width()>=1280){adConfig.companiondiv={id:'headerAd',width:728,height:90};}
if(!json.hasOwnProperty('AdBreak')){console.error('There is now AdBreak');return{};}
vmap=json.AdBreak; 
RUNPREROLL=false;if(INFO.can_play_preroll===true||SETTINGS.canPlayPreroll==="True"){if($.cookie("lastposition")){LASTPOS=$.cookie("lastposition");RUNPREROLL=false; $.cookie("lastposition",null,{expires:-1,path:'/',domain:COOKIE_DOMAIN});}else{LASTPOS=0;RUNPREROLL=true;}}
Object.keys(vmap).forEach(function(adBreak){ if(vmap.hasOwnProperty('breakId')){switch(vmap.breakId){case'preroll':if(RUNPREROLL){schedule.preroll={offset:'pre',tag:String(vmap.AdSource.AdTagURI)};}
break;case'postroll':schedule.preroll={offset:'post',tag:String(vmap.AdSource.AdTagURI)};break;default:if(hmsToSecond(vmap.timeOffset)>start&&hmsToSecond(vmap.timeOffset)>LASTPOS){schedule[vmap.AdSource.id]={offset:hmsToSecond(vmap.timeOffset),tag:String(vmap.AdSource.AdTagURI)};}
break;}}else if(vmap[adBreak].hasOwnProperty('breakId')){switch(vmap[adBreak].breakId){case'preroll':if(RUNPREROLL){schedule.preroll={offset:'pre',tag:String(vmap[adBreak].AdSource.AdTagURI)};}
break;case'postroll':schedule.preroll={offset:'post',tag:String(vmap[adBreak].AdSource.AdTagURI)};break;default:if(hmsToSecond(vmap[adBreak].timeOffset)>start&&hmsToSecond(vmap[adBreak].timeOffset)>LASTPOS){schedule[vmap[adBreak].AdSource.id]={offset:hmsToSecond(vmap[adBreak].timeOffset),tag:String(vmap[adBreak].AdSource.AdTagURI)};}
break;}}});adConfig.schedule=schedule;DFPSCHEDULE=adConfig;createPlayer(VIDEOURL);}
function getDfpAds(duration,start,callback){var dfpTag='http://pubads.g.doubleclick.net/gampad/ads?',dfpAccountId=6735,parentAdUnitName='n6735.pbs',dfpVideoSourceId=4712,videoAdsThreshold=HELPER.getVideoAdsThreshold(),xdr;dfpTag+='sz=400x300&';dfpTag+='iu=/'+dfpAccountId+'/'+parentAdUnitName+'/';if(PRODUCER.indexOf('pbs')!==-1){dfpTag+='PBS_Video_National&';}else{dfpTag+='PBS_Video_'+PRODUCER+'&';}
dfpTag+='ciu_szs=728x90&';dfpTag+='impl=s&';dfpTag+='gdfp_req=1&';dfpTag+='env=vp&';dfpTag+='ad_rule=1&';dfpTag+='vid='+VIDEOID+'&';dfpTag+='cmsid='+dfpVideoSourceId+'&';dfpTag+='output=xml_vmap1&';dfpTag+='unviewed_position_start=1&';dfpTag+='correlator='+HELPER.getRandomNr(10);if(duration<=videoAdsThreshold){DFPSCHEDULE='';createPlayer(VIDEOURL);return null;}
if($.browser.msie&&parseInt($.browser.version,10)<=9){if(window.XDomainRequest){xdr=new XDomainRequest();if(xdr){xdr.onload=function(){dfpToAdSchedule(xdr.responseText,duration,start);};xdr.onerror=function(){console.error('There was an error calling the doubleclick server',dfpTag);createPlayer(VIDEOURL);};xdr.open('GET',dfpTag);xdr.send();}}}else{$.ajax({url:dfpTag}).done(function(data){dfpToAdSchedule(data,duration,start);}).fail(function(){console.error('There was an error calling the doubleclick server',dfpTag);createPlayer(VIDEOURL);});}}
function setVideoData(url,info,encoding){ENCODING=encoding;POSTER=getVideoPoster(info.image_url);CC=info.closed_captions_url;PLAYINFOS=getPlayableParams(info);INFO=info;VIDEOURL=url;PROGRAMSLUG=info.program.slug;PRODUCER=info.program.producer||'';if(VIDEOURL){getDfpAds(PLAYINFOS.duration,LASTPOS||PLAYINFOS.start);}
if(SETTINGS.playerType==='portal'){PBS.videoPage.setData(info);if(RUNONCE){HELPER.updateEmbedDimensions('#embed-video',CURRENTURL,VIDEOID);RUNONCE=false;}}}
function init(settings){HELPER=PBS.Helper;LOCATION=window.location.protocol+'//'+
window.location.hostname+
window.location.pathname+
window.location.search;CURRENTURL=window.location.protocol+'//'+
window.location.hostname+'/';PLAYERID='player'; PLAYERTYPE=settings.playerType;SETTINGS=settings;VIDEOID=SETTINGS.videoId;if(PLAYERTYPE==='portal'){VIDEOID=(window.location.pathname).replace(/\D/g,'');}
if($.cookie("lastposition")&&!settings.sameVideo){LASTPOS=$.cookie("lastposition"); $.cookie("lastposition",null,{expires:-1,path:'/',domain:COOKIE_DOMAIN});}else{LASTPOS=0;}
if($('#'+PLAYERID).length===0){console.error('#'+PLAYERID+' is not a valid DOM element!');return null;}
PBS.videoInfos(VIDEOID);}
function reloadPlayer(sameVideo){LOCATION=window.location.protocol+'//'+
window.location.hostname+
window.location.pathname+
window.location.search;if(VIDEOID===LOCATION.replace(/\D/g,'')){PBS.jwCCSettings.hide();RUNPREROLL=false;if(VIDEOURL){getDfpAds(PLAYINFOS.duration,LASTPOS||PLAYINFOS.start);}}else{if(VIDEOURL&&!sameVideo){try{managePageUnload();jwplayer().remove();}
catch(err){}}
if(sameVideo){RUNPREROLL=false;jwSettings.sameVideo=sameVideo;$.cookie("lastposition",LASTPOS,{expires:365,path:'/',domain:COOKIE_DOMAIN});}
init(jwSettings);}
if(PLAYERTYPE==='portal'&&$.cookie("lastposition")&&!sameVideo){ $.cookie("lastposition",null,{expires:-1,path:'/',domain:COOKIE_DOMAIN});}}
return{init:init,setVideoData:setVideoData,getPlayableParams:getPlayableParams,loadAditionalContent:loadAditionalContent,reloadPlayer:reloadPlayer,isFinished:isFinished};}());
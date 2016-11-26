/******************************
** ======= FUNCTIONS ======= **
*******************************
** 00. group_color
** 01. ajax_reputation_counter
** 02. profile_field_classifier
** 03.mintion search
** 04.solved button
** 05.mintion avatar
** 06.
******************************/


/* -- 00. group_color -- */
 $(function() {
  for (var a = $('.post'), i = 0, j = a.length, color, rgb, title; i < j; i++) {
    color = $('.postprofile dt .username span[style*="color"]', a[i])[0];

    if (color) {
      title = $('.user-title:first', a[i]);

      color = color.style.color;
      rgb = color.replace(/rgb\(|\)|\s/g, '').split(',');
      rgb = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000) > 125 ? '#000' : '#FFF';

      title.css({
        color : rgb,
        background : color
      });

      $('a', title[0]).attr('style', 'color:' + rgb + ' !important;');
    }
  }
});

/* -- 01. ajax_reputation_counter -- */
$(function(){
  for (var vote = $('.vote'), i = 0, j = vote.length, bar, total, percent, n_pos, n_neg; i < j; i++) {
    bar = $('.vote-bar', vote[i])[0];

    if (bar) {
      total = +bar.title.replace(/.*?\((\d+).*/, '$1');
      percent = +bar.title.replace(/.*?(\d+)%.*/, '$1');

      n_pos = Math.round(total * (percent / 100));
      n_neg = total - n_pos;
    } else {
      n_pos = 0;
      n_neg = 0;
    }

    vote[i].insertAdjacentHTML('afterbegin', '<span class="vote_num vote_good">' + n_pos + '</span>');
    vote[i].insertAdjacentHTML('beforeend', '<span class="vote_num vote_bad">' + n_neg + '</span>');

    $('a', vote[i]).click(function() {
      var that = this,
          links = $('a', that.parentNode);

      $.get(that.href, function() {
        var n = that[/minus/.test(that.className) ? 'nextSibling' : 'previousSibling'];
        n.innerHTML = ++n.innerHTML;
        links.fadeOut();
      });


      links.attr('href', '#').css({
        opacity : 0.4,
        cursor : 'default'
      });

      return false;
    });
  }
});


/* -- 02. profile_field_classifier -- */
$(function() {
  for (var field = $('.profile-field'), i = 0, j = field.length; i < j; i++) {
    field[i].className += ' field_' + $('.label', field[i]).text().toLowerCase().replace(/ : /, '').replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
  }
});




/* -- mintion avatar  -- */

        (function() {
          'DEVELOPED BY ANGE TUTEUR';
          'NO DISTRIBUTION WITHOUT CONSENT OF THE AUTHOR';
          'ORIGIN : http://fmdesign.forumotion.com/t399-display-the-user-avatar-before-mentions#3207';
         
          window.faMentionAvatar = {
            // position modifies the position of the avatar
            // 0 = before mention
            // 1 = after mention
            position : 0,
            cacheTime : 1*60*60*1000, // amount of time the avatar is cached ( 1 hour )
           
            mentions : null, // mention node list
            index : -1, // current index in the mentions array
           
            // checks if the mention is valid and then gets the avatar
            getter : function() {
              var mention = faMentionAvatar.mentions[++faMentionAvatar.index],
                  storage = window.localStorage,
                  id;
                 
              if (mention) {
                id = mention.href.replace(/.*?\/u/, '');
               
                if (storage && storage['mentionAvatar_' + id] && storage['mentionAvatar_' + id + '_exp'] > +new Date - faMentionAvatar.cacheTime) {
                  var avatar = document.createElement('IMG');
                  avatar.className += ' mention-ava';
                  avatar.src = storage['mentionAvatar_' + id];
                  faMentionAvatar.position ? mention.appendChild(avatar) : mention.insertBefore(avatar, mention.firstChild);
                  faMentionAvatar.getter();
                } else {
                  $.get('/ajax/index.php?f=m&user_id=' + id, function(d) {
                    var avatar = $('.tooltip-content > img', d)[0];
                       
                    if (avatar) {
                      faMentionAvatar.position ? mention.appendChild(avatar) : mention.insertBefore(avatar, mention.firstChild);
                     
                      if (storage) {
                        storage['mentionAvatar_' + id] = avatar.src;
                        storage['mentionAvatar_' + id + '_exp'] = +new Date;
                      }
                    }
                    faMentionAvatar.getter();
                  });
                }
              }
            }
          };
         
   
          // statements that need execution when the document is ready
          $(function() {
            faMentionAvatar.mentions = $('.mentiontag');
            faMentionAvatar.getter();
          });
        }());

/* ajax auto see new post */

$(function() {
          window.AJAX_TOPIC = {
            poll_time : 3000,
            post_then : $('.post'),
         
            get : function() {
              $.get(window.location.href + '?view=newest', function(d) {
                AJAX_TOPIC.post_now = $('.post', d);
         
                if (AJAX_TOPIC.post_now.length > AJAX_TOPIC.post_then.length) {
                  AJAX_TOPIC.post_then.last().after(AJAX_TOPIC.post_now.slice(AJAX_TOPIC.post_then.length, AJAX_TOPIC.post_now.length));
                  AJAX_TOPIC.post_then = $('.post');
                }
              });
            }
          };
         
          AJAX_TOPIC.poll = window.setInterval(AJAX_TOPIC.get, AJAX_TOPIC.poll_time);
          'par ange tuteur';
        }); 


/* -- solved button  -- */
$(function() {
          window.$fa_solved = {
         
            icon : {
              id : 8,
              image : 'https://i18.servimg.com/u/f18/13/76/93/58/ks_sol10.png'
            },
         
         lang: {
             mark: '<span>تم البيع ؟</span><div class="soldicon trans"><i class="fa fa-gavel"></i></div>',
             mark_title: 'اضغط هنا',
             mark_title_mod: 'قم بالضغط على زر تم البيع ليعلم الجميع ان اعلانك انتهى ليتم ختمه',
             marking: '<div class="soldicon"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></div>',
             marked: ' <div class="soldicon"><i class="fa fa-check"></i></div> '
         },
         
            post_id : $('.post')[0].id.slice(1),
         
            encode : function(string) {
              return encodeURIComponent(escape(string).replace(/%u[A-F0-9]{4}/g, function(match) {
                return '&#' + parseInt(match.substr(2), 16) + ';';
              })).replace(/%25/g, '%');
            }
         
          };
         
          var main = document.getElementById('main-content'), post = $('.post', main)[0], fid = $('.topic-actions:first .breadcrumbs a:last', main).attr('href'), author = $('.postprofile .username', post).text(),  icon = $('.topic-title img', main),  mod = $('.i_icon_ip', post)[0], button = document.createElement('A');
         
          if (icon[0].src != $fa_solved.icon.image) {
            if (!mod && author != _userdata.username) return;
          } else return;
         
          button.innerHTML = $fa_solved.lang.mark;
          button.title = mod ? $fa_solved.lang.mark_title_mod : $fa_solved.lang.mark_title;
          button.className = 'soldbtn';
          button.href = '#';
         
          button.onclick = function() {
            var t = this, icon = $('.title img', document.getElementById('main-content'));
            t.innerHTML = $fa_solved.lang.marking;
            t.removeAttribute('title');
            t.onclick = function() { return false };
         
            $.get('/post?p=' + $fa_solved.post_id + '&mode=editpost', function(d) {
              var auth = $('input[name="auth[]"]', d);
              $.post('/post', 'subject=' + $fa_solved.encode($('input[name="subject"]', d)[0].value) + '&message=' + $fa_solved.encode($('#text_editor_textarea', d)[0].value) + '&p=' + $fa_solved.post_id + '&post_icon=' + $fa_solved.icon.id + '&mode=editpost&auth[]=' + auth[0].value + '&auth[]=' + auth[1].value + '&post=1', function() {
                t.innerHTML = $fa_solved.lang.marked;
                t.className += ' marked';
                icon.attr('src', $fa_solved.icon.image);
              });
            });
         
            return false;
          };
         
         
          var div = document.getElementById('solve-button');
          if (div) {
            div.appendChild(button);
          }
        });

/* auto edit  */


        var sFE_oldMsg = '',
           oFE_msgID = 0,
           sFE_subject = '',
           iFE_lt = 0,
           sFE_post = 'Send',
           iFE_auth1 = 0,
           iFE_auth2 = 0;
         
        window.onload = function() { // jQuery(function () {
           var sCSS = '' +
              '<style>' +
              '.input_text, .fdfButton {' +
              'padding: 4px !important;' +
              'box-shadow: 0 1px 0 0 #EFF3F8 inset, 0 2px 3px rgba(0, 0, 0, 0.2);' +
              '}' +
              '.row2.desc {' +
              'background-color: #F1F6F9;' +
              'padding: 9px;' +
              'color: #777777;' +
              'font-size: 11px;' +
              '}' +
              '</style>';
           document.head.insertAdjacentHTML('beforeEnd', sCSS);
         
           jQuery('a[href*="mode=editpost"]').click(function(event) {
              event.preventDefault();
              var datahref = jQuery(this).attr('href');
              var post_ID = datahref.split('p=')[1].split('&')[0];
              /* Forum versions! */
              var phpBB2 = jQuery('#p' + post_ID).find('td .postbody div:eq(0)');
              var phpBB3 = jQuery('#p' + post_ID).find('div.content');
              var punbb = jQuery('#p' + post_ID).next().find('div.entry-content');
              var invision = jQuery('#p' + post_ID).find('div.post-entry');
         
              if (phpBB2.length) {
                 oFE_msgID = phpBB2;
              } else if (phpBB3.length) {
                 oFE_msgID = phpBB3;
              } else if (punbb.length) {
                 oFE_msgID = punbb;
              } else if (invision.length) {
                 oFE_msgID = invision;
              };
              fastEditMsg(post_ID);
           });
        }; // });
        /***
         * Fast edit post!
         * Function: fastEditMsg(post_ID);
         */
        fastEditMsg = function(post_ID) {
           if (isNaN(post_ID) || (jQuery('#p' + post_ID).length == 0)) {
              return false
           }
         
           sFE_oldMsg = oFE_msgID.html();
         
           var sHtml = '<div class="main-content topic">' +
              '<div class="post">' +
              '<div id="editor_' + post_ID + '">' +
              '<textarea cols="9" id="text_editor_textarea_' + post_ID + '" name="message" onclick="storeCaret(this)" onkeyup="storeCaret(this)" onselect="storeCaret(this)" rows="15" style="width: 98%; height: 250px;" tabindex="3" wrap="virtual">' +
              '\n\n\n\n\n\nLoading the message, please wait...</textarea>' +
              
              '<fieldset class="submit" style="font-size: 13px !important; padding: 15px 6px; text-align: center; border: 0 none; background-color: #D1DDEA;">' +
              '<input class="button2 fdfButton" name="post" tabindex="6" type="button" value="حفظ التغيرات" onclick="fastEditSave(' + post_ID + ')"> ' +
              '<a class="button2" title="Cancel" href="javascript:void(0);" onclick="fastEditCancel(' + post_ID + ');">الغاء</a>' +
              '<a class="button2" href="/post?p=' + post_ID + '&mode=editpost">الانتقال للوضع المتقدم</a>' +
              '</fieldset>' +
              '</div>' +
              '</div>' +
              '</div>';
           oFE_msgID.html(sHtml);
         
           var text_area = jQuery('#text_editor_textarea_' + post_ID);
           text_area.val(sFE_oldMsg.replace(/<br\s?\/?>/g, "\n"));
           /* text_area.val(HtmlToBBCode(sFE_oldMsg)); */
         
           try {
              text_area.sceditor({
                 locale: "pt",
                 height: "250px",
                 width: "auto",
                 plugins: "bbcode",
                 toolbar: "bold,italic,underline,strike|left,center,right,justify|quote,code,faspoiler,fahide|servimg,image,link,youtube|size,color,font,removeformat|emoticon,date,time,maximize,source",
                 parserOptions: {
                    /*breakAfterBlock: false,*/
                    /*removeEmptyTags: false, */
                    /*fixInvalidNesting: false,*/
                    /*fixInvalidChildren: false*/
                 },
                 style: "http://illiweb.com/rs3/85/frm/SCEditor/minified/jquery.sceditor.default.min.css",
                 rtl: false,
                 emoticonsEnabled: true,
                 emoticonsCompat: true,
                 /* emoticonsRoot: "",
                 emoticonsURL: "/smilies.forum?f=9&mode=smilies_frame&t=1383011440" */
              });
              text_area.sceditor("instance").toggleSourceMode();
              text_area.sceditor("instance").focus();
              jQuery("a.sceditor-button-source").addClass("hover");
              /*jQuery.sceditor.ShowHideToolbarElements();*/
         
              var container = $('.sceditor-container');
              var ciframe = container.find('iframe');
              var ctextarea = container.find('textarea');
              ciframe.width(ciframe.width() - 9);
              ctextarea.width(ctextarea.width() - 9);
              jQuery('.sceditor-resize-cover').show();
           } catch (e) {
              if (typeof(console) != 'undefined') {
                 console.error(e);
              }
           }
         
           jQuery.get("/post?p=" + post_ID + "&mode=editpost", function(data) {
              sFE_subject = jQuery(data).find('input[name="subject"]').val();
              var user_Msg = jQuery(data).find('#text_editor_textarea[name="message"]').val();
              text_area.val(user_Msg);
              text_area.sceditor('instance').val(user_Msg);
         
              iFE_lt = jQuery(data).find('input[name="lt"]').val();
              sFE_post = jQuery(data).find('input[name="post"]').val();
         
              var oTarget = jQuery(data).find('input[name="auth[]"]');
              iFE_auth1 = jQuery(oTarget[0]).val();
              iFE_auth2 = jQuery(oTarget[1]).val();
           }).done(function() {
              jQuery('.sceditor-resize-cover').hide();
           }).fail(function() {
              oFE_msgID.html(sFE_oldMsg);
              swal("حدث خطأ في ارسال طلب التعديل !", "يرجى الانتظار 10 ثواني و اعادة المحاولة مرة اخرى","warning");
           });
           jQuery('html,body').animate({
              scrollTop: jQuery('#p' + post_ID).offset().top
           }, 1200);
        };
        /***
         * Fast cancel post!
         * Function: fastEditCancel(post_ID);
         */
        fastEditCancel = function(post_ID) {
           oFE_msgID.html(sFE_oldMsg);
           jQuery('html,body').animate({
              scrollTop: jQuery('#p' + post_ID).offset().top
           }, 400);
        };
        /***
         * Fast edit post!
         * Function: fastEditSave(post_ID);
         */
        fastEditSave = function(post_ID) {
           if (isNaN(post_ID) || (jQuery('#p' + post_ID).length == 0)) {
              return false
           }
         
           var text_area = jQuery('#text_editor_textarea_' + post_ID);
           var edit_reason = '';
           text_area.sceditor("instance").toggleSourceMode();
           var user_Msg = text_area.sceditor('instance').val();
           var sHtml = text_area.sceditor('instance').getSourceEditorValue();
         
           if (jQuery('#add_edit_' + post_ID).is(':checked')) {
              edit_reason = jQuery('#post_edit_reason_' + post_ID).val();
           }
         
           oFE_msgID.html(sHtml);
 
         
           jQuery.post("/post", {
              p: post_ID,
              lt: iFE_lt,
              auth: iFE_auth1,
              auth: iFE_auth2,
              mode: 'editpost',
              subject: sFE_subject,
              message: user_Msg,
              edit_reason: edit_reason,
              attach_sig: 1,
              notify: 0,
              post: sFE_post
           }).done(function() {
              /* */
           }).fail(function() {
              oFE_msgID.html(sFE_oldMsg);
              swal("خطأ", "حدث خطأ اثناء حفظ التعديل , يرجى الانتظار 10 ثواني و اعادة المحاولة مرة اخرى","warning");
               
           });
           jQuery('html,body').animate({
              scrollTop: jQuery('#p' + post_ID).offset().top
           }, 400);
        };



 /*  share buttons */
$(function () {
    $('.share').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.animate({ 'width': $this.width() == 180 ? '35px' : '180px' }, 100, 'swing');
    });
});


/* sticky topic tool */
$(function () {
    var stickySidebar = $('.sticky');
    if (stickySidebar.length > 0) {
        var stickyHeight = stickySidebar.height(), sidebarTop = stickySidebar.offset().top;
    }
    $(window).scroll(function () {
        if (stickySidebar.length > 0) {
            var scrollTop = $(window).scrollTop();
            if (sidebarTop < scrollTop) {
                stickySidebar.addClass("stuck").css('top', scrollTop - sidebarTop);
                var sidebarBottom = stickySidebar.offset().top + stickyHeight, stickyStop = $('.topic-container').offset().top + $('.topic-container').height();
                if (stickyStop < sidebarBottom) {
                    var stopPosition = $('.topic-container').height() - stickyHeight;
                    stickySidebar.css('top', stopPosition).removeClass("stuck");
                }
            } else {
                stickySidebar.css('top', '0').removeClass("stuck");
            }
        }
    });
    $(window).resize(function () {
        if (stickySidebar.length > 0) {
            stickyHeight = stickySidebar.height();
        }
    });
});


/* sold button */

(function () {
    var removeSuccess;
    removeSuccess = function () {
        return $('.soldbtn').removeClass('success');
    };
    $(document).ready(function () {
        return $('.soldbtn').click(function () {
            $(this).addClass('success');

        });
    });
}.call(this));



/* add friends */
$(function() {
           if (!_userdata.session_logged_in) {
              return false;
           }
           var FFinPosts = {
              sFriend: "Add As Friend",
              sFoes: "Add To Foes",
              oTarget: $('.post'),
              iLen: 0,
              sUser_name: "",
              oFF_list: null,
              aFF_list: [],
              vTemp: null,
              oThis: null
           };
           FFinPosts.iLen = FFinPosts.oTarget.length;
         
           $.ajax({
              url: "/u" + _userdata.user_id + 'friends',
              cache: false,
              type: "get",
              dataType: "text",
              success: function(response, status, xhr) {
                 if (xhr.status == 200) {
                    FFinPosts.oFF_list = $('#profile-advanced-details ol .message-header > a[href^="/u"]', response);
         
                    for (var i = 0; i < FFinPosts.oFF_list.length; i++) {
                       FFinPosts.aFF_list[FFinPosts.aFF_list.length] = $(FFinPosts.oFF_list[i]).text();
                    }
         
                    for (var i = 0; i < FFinPosts.iLen; i++) {
                       FFinPosts.oThis = $(FFinPosts.oTarget[i]);
                       FFinPosts.sUser_name = FFinPosts.oThis.find('.username a, .name, .user a[href^="/u"]').text();
         
                       if (FFinPosts.sUser_name !== _userdata.username) {
                          FFinPosts.vTemp = FFinPosts.oThis.find('.postprofile dd:last, .postdetails.poster-profile, .user-contact');
         
                          if (FFinPosts.aFF_list.indexOf(FFinPosts.sUser_name) == -1) {
                             FFinPosts.vTemp.append(
                                '<br><a title="اضافة الى الاصدقاء" class="profile-icon" href="/profile?friend=' + encodeURIComponent(FFinPosts.sUser_name) + '&mode=editprofile&page_profil=friendsfoes">' +
                                '   <img alt="Add As Friend" src="https://i97.servimg.com/u/f97/19/14/82/76/add-2410.png" >' +
                                '</a>'
                             )
                          } else {
                             FFinPosts.vTemp.append(
                                '<br><a title="حظر هذا العضو" class="profile-icon" href="/profile?foe=' + encodeURIComponent(FFinPosts.sUser_name) + '&mode=editprofile&page_profil=friendsfoes">' +
                                '   <img alt="Add To Foes" src="https://i97.servimg.com/u/f97/19/14/82/76/cancel10.png" >' +
                                '</a>'
                             )
                          }
                       }
                    }
                 }
              }
           });
        });



/* BBCode Gallery */
        jQuery(document).ready(function($) {
         
         var jSpeed = 400;// Set the change speed of the image
         var jDirection;
         
         $('head').append(
         '<style type="text/css">' +
          '#overlay_gallery {' +
          '  background-color: #000;' +
          '  right: 0;' +
          '  bottom: 0;' +
          '  left: 0;' +
          '  opacity: 0.8;' +
          '  position: fixed;' +
          '  top: 0;' +
          '  z-index: 999;' +
          '}' +
          '.lightbox_gallery {' +
          '  position: fixed;' +
          '  top: 8%;' +
          '  max-height: 85%;' +
          '  left: 0px;' +
          '  display: flex;' +
          '  text-align: center;' +
          '  width: 100%;' +
          '  z-index: 999;' +
          '}' +
          '.close-gallery {' +
          '  background: #fff url(https://cdn4.iconfinder.com/data/icons/gnome-desktop-icons-png/PNG/32/Gnome-Window-Close-32.png) no-repeat center;' +
          '  padding: 5px;' +
          '  height: 32px;' +
          '  width: 32px;' +
          '  border-radius: 0 0 0 3px;' +
          '  cursor: pointer;' +
          '  position: absolute;' +
          '  right: 3px;' +
          '  top: 3px;' +
          '}' +
          '.lightbox_gallery img {max-width: 100%;margin: 0 auto;}' +
          '  .lb-gallery {' +
          '  -moz-border-radius-: 4px;' +
          '  -webkit-border-: 4px;' +
          '  background-color: #fff;' +
          '  border-radius: 4px;' +
          '  margin: 0 auto;' +
          '  max-width: 65%;' +
          '  min-height: 130px;' +
          '  min-width: 250px;' +
          '  position: relative;' +
          '  zoom: 1;' +
          '}' +
          '.lb-gallery-container {' +
          '  padding: 4px;' +
          '}' +
          '#gallery_bs {' +
          '  background-color: #222;' +
          '  min-height: 400px;' +
          '  margin: 10px auto;' +
          '  position: relative;' +
          '  width: 650px;' +
          '  -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.7);' +
          '  -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.7);' +
          '  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.7 );' +
          '}' +
          '#gallery_bs .prev, #gallery_bs .next {' +
          '  background-color: #121212;' +
          '  border-radius: 5px;' +
          '  padding: 3px;' +
          '  opacity: 0;' +
          '  height: 32px;' +
          '  width: 32px;' +
          '  position: absolute;' +
          '  z-index: 200;' +
          '  cursor: pointer;' +
          '  top: 240px;' +
          '  background-repeat: no-repeat;' +
          '  background-position: center;' +
          '}' +
          '#gallery_bs:hover .prev, #gallery_bs:hover .next {' +
          '  -moz-transition: all .4s linear;' +
          '  -o-transition: all .4s linear;' +
          '  -webkit-transition: all .4s linear;' +
          '  opacity: 1;' +
          '}' +
          '.gallery_bs {' +
          '  height: 348px;' +
          '  text-align: center;' +
          '}' +
          '#gallery_bs .image_bs {' +
          '  cursor: pointer;' +
          '  max-height: 100% !important;' +
          '  max-width: 100% !important;' +
          '  width: 100% !important;' +
          '  -moz-transition: all .2s linear;' +
          '  -o-transition: all .2s linear;' +
          '  -webkit-transition: all .2s linear;' +
          '}' +
          '#gallery_bs .prev {background-image: url(http://i.imgur.com/V93QBXz.png);left: 20px;}' +
          '#gallery_bs .next {background-image: url(http://i.imgur.com/PTqQ1DY.png);right: 20px;}' +
          '#gallery_bs .header_gal {' +
          '  background: linear-gradient(to left, #000428 , #004e92); ;' +
          '  padding: 5px 20px;' +
          '  text-align: center;' +
          '}' +
          '.scroll_gal {' +
          '  max-width: 100%;' +
          '  min-width: 100%;' +
          '  white-space: nowrap;' +
          '  overflow-x: auto;' +
          '  overflow-y: hidden;' +
          '}' +
          '.scroll_gal::-webkit-scrollbar {' +
          '  height: 10px;' +
          '}' +
          '.scroll_gal::-webkit-scrollbar-track {' +
          '  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);' +
          '  border-radius: 10px;' +
          '}' +
          '.scroll_gal::-webkit-scrollbar-thumb {' +
          '  background-color: #666;' +
          '  border-radius: 10px;' +
          '  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);' +
          '}' +
          '#gallery_bs .header_gal img {' +
          '  width: 85px;' +
          '  height: 85px;' +
          '  padding: 0px;' +
          '  margin: 5px;' +
          '  border-style: solid;' +
          '  border-width: 3px;' +
          '  transition: all linear .2s;' +
          '  cursor: pointer;' +
          '  border-radius: 7px;' +
          '}' +
          '#gallery_bs .header_gal img:hover {' +
          '  -moz-box-shadow: 0 0 5px rgba(0, 0, 0, .4);' +
          '  -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, .4);' +
          '  box-shadow: 0 0 5px rgba(0, 0, 0, .4);' +
          '  border-color: #777;' +
          '}' +
          '</style>'
         );
         $('body').append(
         '<div id="overlay_gallery" class="overlay_gallery" style="display: none;"></div>' +
         '<div id="lightbox_gallery" class="lightbox_gallery" style="display: none;">' +
         '  <div class="lb-gallery">' +
         '    <div class="lb-gallery-container">' +
         '      <span class="close-gallery" onclick="close_pop_up()"></span>' +
         '      <img class="lb-gallery-image">' +
         '    </div>' +
         '  </div>' +
         '</div>'
         );
         
         var jContent = $('.postbody, .blog_message');
            jContent.html(function() {
                      return $(this)
                      .html()
                      .replace(/\[gallery](.*?)\[\/gallery\]/g,'<div id="gallery_bs" class="image_gallery"><div class="header_gal"><p class="scroll_gal">$1</p></div><span class="prev"></span><span class="next"></span><div class="gallery_bs"><img class="image_bs" onclick="open_pop_up(this)" /></div></div>');
            });
         
         var gallery = $('.image_gallery');
              for(var x = gallery, i = 0, e; (e = x[i++]);) { 
                var jThis = $(e);
                var jImg = jThis.find('img');
                var jImgSrc = jImg.attr('src');
                var jImageBs = jThis.find('.image_bs');
                jImageBs.attr('src', jImgSrc);
                jImg.click(function() {
                        var jThisSrc = $(this).attr('src');
                        jImageBs.fadeOut(jSpeed, function() {
                            jImageBs.attr('src', jThisSrc).fadeIn();
                        });
                });
         
                jThis.find('.prev, .next').click(function() {
                      var jChange = $(this);
                      var jCurrentSrc = jImageBs.attr('src');
                      var jCurrentImg = jThis.find('img[src="' + jCurrentSrc + '"]');
                      jImageBs.fadeOut(jSpeed, function() {
                          if(jChange.hasClass('prev')) {
                              jDirection = jCurrentImg.prev().attr('src');
                          } else {
                              jDirection = jCurrentImg.next().attr('src');
                          }
                          jImageBs.attr('src', jDirection).fadeIn();
                      });
                });
         
              }
        });
         function open_pop_up(GAL) {
                      var jSrc = $(GAL).attr('src');
                      $('#overlay_gallery').fadeIn('slow', function() {
                        $('#lightbox_gallery').fadeIn('fast');
                        $('.lb-gallery-image').attr('src', jSrc);
                      });
         }
         function close_pop_up() {
                      $('#lightbox_gallery').fadeOut('slow', function() {
                        $('#overlay_gallery').fadeOut('fast');
                      });
         }



/* Quick Reply without refreshing */
        $(function () {
        $('#quick_reply input[name="post"]').click(function(a){
        a.preventDefault();
        var g = $("#text_editor_textarea").sceditor('instance').val();
        var href = $('a[href*="mode=reply"]').attr("href");
        var value = $("#text_editor_textarea").sceditor("instance").val().replace(/\s/g, '').length;
        if(10 <= value){
        $('<span class="lreply" style="color: red;font-weight: bold; text-transform: uppercase;"><br>يتم الارسال ...</span>').appendTo("#quick_reply div:last");
        $("#text_editor_textarea").val($("#text_editor_textarea").sceditor('instance').val());
        $.post('/post', $('#quick_reply').serialize() + '&post=Send', function(t) {
         
        if(t.indexOf("Flood") != -1){
        swal("خطأ", "هذا الموقع يتطلب بأن تنتظر 10 ثواني بين كل عملية وأخرى","warning");
        $(".lreply").fadeOut(300);
        }
        if(t.indexOf("A new") != -1){
        swal( "هناك شخص قام بالتعليق على المنشور في نفس الوقت","يجب تحديث الصفحة و المحاولة مرة اخرى ، ملاحظة : تأكد من حفظك للمحتوى في صندوق المحرر قبل تحديث الصفحة","warning");
        $(".lreply").fadeOut(300);
        }
        if($(t).find('.content-block a[href*="/viewtopic"]:first').attr('href').length >1) {
        var f = $(t).find('.content-block a[href*="/viewtopic"]:first').attr('href');
        var postid = f.split('#')[1];
        $.get(f , function(z){
        $("#quick_reply input[name='auth[]']:last").val($(z).find("#quick_reply input[name='auth[]']:last").val());
        $("#quick_reply input[name='lt']").val($(z).find("#quick_reply input[name='lt']").val());
        $(z).find("#p"+postid).hide().insertAfter(".post:last").slideDown(400);
        location.href = f;
        });
        $("#text_editor_textarea").sceditor('instance').val("");
        $(".lreply").fadeOut(300);
        }
        });
        }
        else {
  		swal("خطأ", "عدد حروف المحتوى الذي أدخلته قصير جداً ، يجب أن يتجاوز ردك 10 حروف","warning");
        }
        });
        });

/* social share window */

  $(function(){
  
  var shareButtons = document.querySelectorAll(".share-btn");

  if (shareButtons) {
      [].forEach.call(shareButtons, function(button) {
      button.addEventListener("click", function(event) {
 				var width = 650,
            height = 450;

        event.preventDefault();

        window.open(this.href, 'Share Dialog', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width='+width+',height='+height+',top='+(screen.height/2-height/2)+',left='+(screen.width/2-width/2));
      });
    });
  }

})();


/* guest reply */

$(function () {
         
            if (_userdata.session_logged_in || document.getElementById('quick_reply')) return;
         
            var reply = $('.i_reply')[0];
         
            if (reply) reply = reply.parentNode;
            else return;
              window.plugins = '';
              window.palette = 0;
              window.illiweb = 'http://illiweb.com/';
              window.locale = 'ar';
              window.height = '250';
              window.plugin = 'bbcode';
              window.toolbar = 'bold,italic,underline,strike|left,center,right,justify|bulletlist,orderedlist,horizontalrule|quote,code,faspoiler,fahide,table|servimg,image,link,youtube|date,headers,size,emoticon,color,font,removeformat|subscript,superscript|fascroll,faupdown,farand,faroll|pastetext,source';
              window.cssFile = 'http://illiweb.com/rs3/46/frm/SCEditor/minified/jquery.sceditor.default.min.css';
              window.isRtl = 0;
              window.dice = [];
              window.bSourceMode = false;
              window.emoticonsEnabled = 1;
              window.smileys =  {};
              window.iframeSrc = '/smilies.forum?mode=smilies_frame&t=1440581833';
              window.illiwebDomain = 'http://illiweb.com/';
              window.INTRANET = 0;
         
            $.get(reply.href, function (d) {
                var quick_reply = document.createElement('FORM'),
                    area = $('#text_editor_textarea', d)[0],
                    data = $('.submit-buttons', d)[0],
                    anchor = document.anchors.quickreply,
                    scripts, i, j, n;
                quick_reply.id = 'quick_reply';
                quick_reply.action = '/post';
                quick_reply.method = 'post';
                quick_reply.name = 'post';
                quick_reply.enctype = 'multipart/form-data';
                quick_reply.innerHTML = '<div style="width: 50%; clear: both; margin-left: auto; margin-right: auto; text-align: center;"><div style="padding: 8px 24px;background: #e6e6e6;border-radius: 8px;margin: 8px;"><span>اسم المستخدم :</span><input class="inputbox" type="text" name="username" maxlength="25" value=""></div></div><link rel="stylesheet" href="http://illiweb.com/rs3/46/frm/SCEditor/src/themes/fa.default.min.css" type="text/css" media="all" /></div>';
         
                area && quick_reply.firstChild.appendChild(area);
                data && quick_reply.firstChild.appendChild(data);
         
                anchor.parentNode.insertBefore(quick_reply, anchor.nextSibling);
         
                scripts = [
        'http://illiweb.com/rs3/46/frm/jquery/cookie/jquery.cookie.js',
        'http://illiweb.com/rs3/46/frm/SCEditor/src/jquery.sceditor.js',
        'http://illiweb.com/rs3/46/frm/SCEditor/src/plugins/bbcode.js',
        'http://illiweb.com/rs3/46/frm/SCEditor/src/sceditor-commands.js',
        'http://illiweb.com/rs3/46/frm/SCEditor/src/sceditor-commands-bbcode.js',
        'http://illiweb.com/rs3/46/frm/SCEditor/src/sceditor-custom-bbcode.js',
        'http://illiweb.com/rs3/46/frm/SCEditor/src/instance-sceditor.js'
        ];
         
                for (i = 0, j = scripts.length; i < j; i++) {
                    n = document.createElement('SCRIPT');
                    n.type = 'text/javascript';
                    n.src = scripts[i];
                    quick_reply.appendChild(n);
                }
            });
         }());

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




/* -- mintion search  -- */
        !window.fa_mentionner && !/\/privmsg|\/profile\?mode=editprofile&page_profil=signature/.test(window.location.href) && $(function(){$(function(){
          'SCEDITOR @HANDLE AUTO-SUGGEST';
          'DEVELOPED BY ANGE TUTEUR';
          'NO DISTRIBUTION WITHOUT CONSENT OF THE AUTHOR';
          'ORIGIN : http://fmdesign.forumotion.com/t943-auto-suggest-mentions-as-you-type#19157';
         
          var container = $('.sceditor-container')[0],
              text_editor = document.getElementById('text_editor_textarea'),
              frame,
              instance;
         
          if (container && text_editor) {
         
            frame = $('iframe', container);
            instance = $(text_editor).sceditor('instance');
         
            window.fa_mentionner = {
              suggest_delay : 100, // delay before suggestions show up (100ms)
         
              // language presets
              lang : {
                placeholder : 'Searching...',
                not_found : 'User not found'
              },
         
              // colors of the suggestion popup
              color : {
                      font : '#333',
                hover_font : '#FFF',
                error_font : '#F00',
         
                      background : '#FFF',
                hover_background : '#69C',
         
                border : '#CCC',
                shadow : 'rgba(0, 0, 0, 0.176)'
              },
         
              // sceditor instance and rangeHelper
              instance : instance,
              rangeHelper : instance.getRangeHelper(),
         
              // cached nodes for listening and modifications
              frame : frame[0],
              body : frame.contents().find('body')[0],
              textarea : $('textarea', container)[0],
         
              // faux textarea and suggestion list
              faux_textarea : $('<div id="faux_text_editor" />')[0], // helps us mirror the cursor position in source mode
              list : $('<div id="fa_mention_suggestions" style="position:absolute;" />')[0],
         
              // version specific selectors
              selectors : $('.bodyline')[0] ? ['a.gen[href^="/u"]', '.avatar.mini a'] :
                          document.getElementById('ipbwrapper') ? ['.membername', '.mini-avatar'] :
                          null,
         
         
              // adjusts the scroll position of the faux textarea so the caret stays in line
              adjustScroll : function() {
                fa_mentionner.faux_textarea.scrollTop = fa_mentionner.textarea.scrollTop;
              },
         
         
              // updates the content in the faux textarea
              updateFauxTextarea : function(active, key) {
                if (key == 16) { // 16 = SHIFT
                  return; // return when specific keys are pressed
                }
         
                // clear suggestion queue when suggestions aren't active
                if (active != true) {
                  fa_mentionner.clearSuggestions();
                } else {
                  return; // return when interactive keys are pressed while suggesting ; up, down, enter
                }
         
                // use another method if in WYSIWYG mode
                if (!fa_mentionner.instance.inSourceMode()) {
                  key != 32 ? fa_mentionner.searchWYSIWYG() : fa_mentionner.clearSuggestions();
                  return;
                }
         
                var val = fa_mentionner.instance.val(),
                    range = 0,
                    selection,
                    faux_caret,
                    username;
         
                // get the position of the caret
                if (document.selection) {
                  selection = document.selection.createRange();
                  selection.moveStart('character', -fa_mentionner.textarea.length);
                  range = selection.text.length;
                } else if (fa_mentionner.textarea.selectionStart || fa_mentionner.textarea.selectionStart == 0) {
                  range = fa_mentionner.textarea.selectionStart;
                }
         
                // set the position of the caret
                val = val.slice(0, range) + '{FAUX_CARET}' + val.slice(range, val.length);
         
                // parse and sanitize the faux textarea content
                $(fa_mentionner.faux_textarea).html(
                  val.replace(/</g, '<')
                    .replace(/>/g, '>')
                    .replace(/@"(.*?)"|@(.*?)(?:\s|\r|\n|$)/g, function(M, $1, $2) {
                      var lastChar = M.substr(-1),
                          name = ($1 || $2 || '').replace(/\{FAUX_CARET\}|"/g, '');
         
                      return '<a href="#' + name + '">' + (/\s|\r|\n/.test(M) ? M.slice(0, M.length - 1) + '</a>' + lastChar : M + '</a>');
                    })
                    .replace(/\{FAUX_CARET\}/, '<span id="faux_caret" style="position:absolute;margin-left:-3px;">|</span>')
                );
         
                faux_caret = document.getElementById('faux_caret');
         
                // mentions are parsed as <a>nchors, so when the faux caret is inside one we'll show some suggestions
                if (faux_caret && faux_caret.parentNode.tagName == 'A') {
                  fa_mentionner.value = val;
         
                  fa_mentionner.delay = window.setTimeout(function() {
                    fa_mentionner.suggest(faux_caret.parentNode.href.replace(/.*?#(.*)/, '$1'), $(faux_caret).offset());
                  }, fa_mentionner.suggest_delay);
         
                }
         
                fa_mentionner.adjustScroll();
              },
         
         
              // search for active mentions in wysiwyg mode
              searchWYSIWYG : function() {
                var selected = fa_mentionner.rangeHelper.cloneSelected(),
                    mentions = selected.startContainer.data && selected.startContainer.data.match(/(@".*?")|(@.*?)(?:\s|\r|\n|$)/g),
                    offset,
                    offset_marker,
                    hit,
                    i;
         
                    console.log(mentions);
         
                if (mentions && mentions[0]) {
         
                  // clean up whitespace
                  for (i in mentions) {
                    mentions[i] = mentions[i].replace(/\s$/g, '');
                  }
         
                  // search for the mention that's currently being modified
                  for (i in mentions) {
                    if (!fa_mentionner.wysiwyg_mentions || (mentions[i] != fa_mentionner.wysiwyg_mentions[i])) {
                      hit = true;
         
                      fa_mentionner.delay = window.setTimeout(function() {
                        fa_mentionner.rangeHelper.insertMarkers(); // insert markers to help get the caret offset
         
                        offset = $(fa_mentionner.frame).offset();
                        offset_marker = $('#sceditor-end-marker', fa_mentionner.body).show().offset();
         
                        // add the marker offsets to the iframe offsets
                        offset.left += offset_marker.left;
                        offset.top += offset_marker.top - fa_mentionner.body.scrollTop;
         
                        fa_mentionner.suggest(mentions[i].slice(1).replace(/^"|"$/g, ''), offset, true);
                        fa_mentionner.wysiwyg_active = mentions[i]; // save the active mention for later use in finish()
                      }, fa_mentionner.suggest_delay);
         
                      break;
                    }
                  }
         
                  // hide the suggestion list if there's no newly modified mentions
                  if (!hit) {
                    fa_mentionner.list.style.display = 'none';
                    fa_mentionner.focused = null;
                  }
         
                  fa_mentionner.wysiwyg_mentions = mentions; // update the list of mentions
         
                }
              },
         
              // suggest a list of users based on the passed username
              suggest : function(username, offset, wysiwyg) {
         
                // insert the suggestion list to show that it's searching
                fa_mentionner.list.innerHTML = '<span class="fam-info">' + fa_mentionner.lang.placeholder + '</span>';
                $(fa_mentionner.list).css({
                  left : offset.left + 'px',
                  top : offset.top + 'px',
                  display : 'block',
                  overflowY : 'auto'
                });
         
                document.body.appendChild(fa_mentionner.list);
         
                // send a query request to the memeberlist to find users who match the typed username
                fa_mentionner.request = $.get('/memberlist?username=' + username, function(d) {
                  fa_mentionner.request = null;
         
                  var suggestion = $(fa_mentionner.selectors ? fa_mentionner.selectors[0] : '.avatar-mini a', d),
                      ava = fa_mentionner.selectors ? $(fa_mentionner.selectors[1], d) : null,
                      i = 0,
                      j = suggestion.length,
                      name;
         
                  fa_mentionner.list.innerHTML = '';
         
                  if (j) {
                    for (; i < j; i++) {
                      name = $(suggestion[i]).text().replace(/^\s+|\s+$/g, '');
         
                      fa_mentionner.list.insertAdjacentHTML('beforeend',
                        '<a href="javascript:fa_mentionner.finish(\'' + name.replace(/'/g, '\\\'') + '\', ' + wysiwyg + ');" class="fa_mention_suggestion">'+
                          '<img class="fa_suggested_avatar" src="' + $(fa_mentionner.selectors ? ava[i] : suggestion[i]).find('img').attr('src') + '"/>'+
                          '<span class="fa_suggested_name">' + name + '</span>'+
                        '</a>'
                      );
                    }
         
                    // change overflowY property when it exceeds 7 suggestions -- prevents unsightly scroll bug
                    fa_mentionner.list.style.overflowY = j > 7 ? 'scroll' : 'auto';
         
                    // update the focused suggestion and scroll it into view
                    fa_mentionner.list.firstChild.className += ' fam-focus';
                    fa_mentionner.focused = fa_mentionner.list.firstChild;
                    fa_mentionner.scrollSuggestions();
         
                  } else {
                    fa_mentionner.list.innerHTML = '<span class="fam-info" style="color:' + fa_mentionner.color.error_font + ';">' + fa_mentionner.lang.not_found + '</span>';
                  }
         
                });
              },
         
         
              // kill the suggestion timeout while typing persists
              clearSuggestions : function() {
                if (fa_mentionner.delay) {
                  window.clearTimeout(fa_mentionner.delay);
                  fa_mentionner.delay = null;
         
                  fa_mentionner.list.style.display = 'none';
                  fa_mentionner.focused = null;
                }
         
                if (fa_mentionner.request) {
                  fa_mentionner.request.abort();
                  fa_mentionner.request = null;
                }
              },
         
         
              // finish the username
              finish : function(username, wysiwyg) {
                var mention, index, i;
         
                // hide and clear suggestions
                fa_mentionner.clearSuggestions();
                fa_mentionner.focused = null;
                fa_mentionner.list.style.display = 'none';
         
                if (!wysiwyg) {
                  fa_mentionner.value = fa_mentionner.value.replace(/(?:@".[^"]*?\{FAUX_CARET\}.*?"|@\{FAUX_CARET\}.*?(\s|\n|\r|$)|@.[^"\s]*?\{FAUX_CARET\}.*?(\s|\n|\r|$))/, function(M, $1, $2) {
                    mention = '@"' + username + '"';
                    return '{MENTION_POSITION}' + ( $1 ? $1 : $2 ? $2 : '' );
                  });
         
                  // get the index where the mention should be
                  index = fa_mentionner.value.indexOf('{MENTION_POSITION}');
                  fa_mentionner.value = fa_mentionner.value.replace('{MENTION_POSITION}', '');
         
                  // save current scroll position for application after the value has been updated
                  fa_mentionner.scrollIndex = fa_mentionner.textarea.scrollTop;
         
                  // update the textarea with the completed mention
                  fa_mentionner.instance.val('');
                  fa_mentionner.instance.insert(fa_mentionner.value.slice(0, index) + mention, fa_mentionner.value.slice(index, fa_mentionner.value.length));
         
                  // restore the scroll position for the textareas
                  fa_mentionner.textarea.scrollTop = fa_mentionner.scrollIndex;
                  fa_mentionner.adjustScroll();
         
                  // update the fake textarea
                  fa_mentionner.updateFauxTextarea();
         
                } else {
                  // save the caret range in WYSIWYG so we can restore it after replacing the HTML
                  fa_mentionner.rangeHelper.saveRange();
                  fa_mentionner.body.innerHTML = fa_mentionner.body.innerHTML.replace(new RegExp(fa_mentionner.wysiwyg_active.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '(<span.*?id="sceditor-end-marker".*?>)'), '@"' + username + '"$1');
                  fa_mentionner.body.focus();
                  fa_mentionner.rangeHelper.restoreRange();
         
                  // update the wysiwyg mention array so no new suggestions appear
                  for (i in fa_mentionner.wysiwyg_mentions) {
                    if (fa_mentionner.wysiwyg_mentions[i] == fa_mentionner.wysiwyg_active) {
                      fa_mentionner.wysiwyg_mentions[i] = '@"' + username + '"';
                      break;
                    }
                  }
                }
              },
         
         
              // scroll the selected suggestion into view
              scrollSuggestions : function() {
                $(fa_mentionner.list).scrollTop(
                  (
                    $(fa_mentionner.focused).offset().top -
                    $(fa_mentionner.list).offset().top +
                    $(fa_mentionner.list).scrollTop()
                  ) -
         
                  (26 * 3) // 26 = the height of the suggestions, so display 3 suggestions above while scrolling
                );
              }
            };
         
            // get computed styles for the textarea and apply them to the faux textarea
            for (var css = window.getComputedStyle(fa_mentionner.textarea, null), i = 0, j = css.length, str = ''; i < j; i++) {
              str += css[i] + ':'  + css.getPropertyValue(css[i]) + ';';
            }
         
            // add styles to the head
            $('head').append('<style type="text/css">'+
              '#faux_text_editor {' + str + '}'+
              '#faux_text_editor { position:absolute; left:0; bottom:0; z-index:-1; visibility:hidden; display:block; overflow-y:auto; }'+
              '#fa_mention_suggestions { color:' + fa_mentionner.color.font + '; font-size:10px; font-family:arial, verdana, sans-serif; background:' + fa_mentionner.color.background + '; border:1px solid ' + fa_mentionner.color.border + '; margin-top:20px; z-index:999; max-height:182px; overflow-x:hidden; box-shadow:0 6px 12px ' + fa_mentionner.color.shadow + '; }'+
              'a.fa_mention_suggestion, .fam-info { color:' + fa_mentionner.color.font + '; height:26px; line-height:26px; padding:0 3px; display:block; white-space:nowrap; cursor:pointer; }'+
              'a.fa_mention_suggestion.fam-focus { color:' + fa_mentionner.color.hover_font + '; background:' + fa_mentionner.color.hover_background + '; }'+
              '.fa_suggested_avatar { height:20px; width:20px; vertical-align:middle; margin-right:3px; }'+
            '</style>');
         
            // insert faux textarea into document
            fa_mentionner.textarea.parentNode.insertBefore(fa_mentionner.faux_textarea, fa_mentionner.textarea);
         
            // apply event handlers
            fa_mentionner.textarea.onclick = fa_mentionner.updateFauxTextarea;
            fa_mentionner.textarea.onscroll = fa_mentionner.adjustScroll;
         
            // update the faux textarea on keyup
            fa_mentionner.instance.keyUp(function(e) {
              if (fa_mentionner.focused && e && (e.keyCode == 13 || e.keyCode == 38 || e.keyCode == 40)) {
                fa_mentionner.updateFauxTextarea(true, e.keyCode);
                return false;
              } else {
                fa_mentionner.updateFauxTextarea(false, e.keyCode);
              }
            });
         
            // key events for the suggested mentions
            $([document, fa_mentionner.body]).on('keydown', function(e) {
              var that = e.target;
         
              if (fa_mentionner.focused && e && e.keyCode && (that.tagName == 'TEXTAREA' || that.tagName == 'BODY')) {
         
                // move selection down
                if (e.keyCode == 40) {
                  var next = fa_mentionner.focused.nextSibling;
         
                  if (next) {
                    $(fa_mentionner.focused).removeClass('fam-focus');
                    next.className += ' fam-focus';
                    fa_mentionner.focused = next;
         
                    fa_mentionner.scrollSuggestions();
                  }
         
                  return false;
                }
         
                // move selection up
                if (e.keyCode == 38) {
                  var prev = fa_mentionner.focused.previousSibling;
         
                  if (prev) {
                    $(fa_mentionner.focused).removeClass('fam-focus');
                    prev.className += ' fam-focus';
                    fa_mentionner.focused = prev;
         
                    fa_mentionner.scrollSuggestions();
                  }
         
                  return false;
                }
         
                // apply selection
                if (e.keyCode == 13) {
                  fa_mentionner.focused.click();
                  return false;
                }
         
              }
            });
         
            // update focused suggestion on hover
            $(document).on('mouseover', function(e) {
              var that = e.target;
         
              if (/fa_mention_suggestion/.test(that.className)) {
                $(fa_mentionner.focused).removeClass('fam-focus');
                that.className += ' fam-focus';
                fa_mentionner.focused = that;
              }
            });
          }
        })});


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


/* -- guest replay -- */
        $(function() {
          var reply = $('.i_reply').parent()[0];
         
          if (!_userdata.session_logged_in && reply) {
            $.get(reply.href, function(d) {
              var form = $('form[name="post"]', d);
         
              form.find('#smiley-box').hide();
              form.find('#message-box').css({
                width : '100%',
                textAlign : 'center'
              });
         
              $('#logged_out_reply').hide().after(form);
            });
          }
        });


/* ajax auto see new post */
/*
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
        }); */


/* -- solved button  -- */
$(function() {
          window.$fa_solved = {
         
            icon : {
              id : 8,
              image : 'http://i18.servimg.com/u/f18/13/76/93/58/ks_sol10.png'
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
              alert('تنبيه!\n\n حدث خطأ في ارسال طلب التعديل , يرجى الانتظار 10 ثواني و اعادة المحاولة مرة اخرى !');
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
              alert('تنبيه !\n\n حدث خطأ اثناء حفظ التعديل , يرجى الانتظار 10 ثواني و اعادة المحاولة مرة اخرى');
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
                                '   <img alt="Add As Friend" src="http://i97.servimg.com/u/f97/19/14/82/76/add-2410.png" >' +
                                '</a>'
                             )
                          } else {
                             FFinPosts.vTemp.append(
                                '<br><a title="حظر هذا العضو" class="profile-icon" href="/profile?foe=' + encodeURIComponent(FFinPosts.sUser_name) + '&mode=editprofile&page_profil=friendsfoes">' +
                                '   <img alt="Add To Foes" src="http://i97.servimg.com/u/f97/19/14/82/76/cancel10.png" >' +
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
        alert("خطأ !\nهذا الموقع يتطلب بأن تنتظر 10 ثواني بين كل عملية وأخرى");
        $(".lreply").fadeOut(300);
        }
        if(t.indexOf("A new") != -1){
        alert("خطأ !\nهناك شخص قام بالتعليق على المنشور في نفس الوقت\nيجب تحديث الصفحة و المحاولة مرةاخرى.\nملاحظة : تأكد من حفظك للمحتوى في صندوق المحرر قبل تحديث الصفحة ");
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
        alert("خطأ\nعدد حروف المحتوى الذي أدخلته قصير جداً ،\n يجب أن تتجاوز 10 حروف.");
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

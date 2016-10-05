/******************************
** ======= FUNCTIONS ======= **
*******************************
** 00. fa_initForumModules //
** 01. fa_navactif //
** 02. fa_theme_changer //
** 03. pseudoInputs
** 04. toolbar search mod //
** 05. fae_sticky_nav_panel //
** 06. image resizer
** 07. fae_toggle_category //
** 08. sticky_nav_notifications//
** 09. update_notifier //
******************************/

// IMPORTANT DATA (DO NOT DELETE)
if (!window.FAE) {
  window.FAE = new Object();
}

FAE.board_lang = 'English';


/* -- 03. pseudoInputs -- */
// function to hide all checkboxes / radios and replace them with pseudo inputs
$(function() {
  for (var input = document.getElementsByTagName('INPUT'), i = 0, j = input.length, type; i < j; i++) {
    type = input[i].type;
    if (/radio|checkbox/i.test(type)) {
      input[i].className += ' fa_input_hidden';
      input[i].insertAdjacentHTML('afterend', '<span class="fa_pseudo_' + type + '" onclick="this.previousSibling.click(); return false;"/>');
    }
  }
});

 
/* -- 06. image resizer -- */
(function() {
  window.fa_img_resizer = {
    max_width : 400, // maximum image width (400px)
    max_height : 250, // maximum image height (250px)

    selector : '.postbody .content img, .mod_news img, .message-text img', // where images should be resized

    options : {
            bar : true, // resized image options bar
        toggler : true, // Enlarge / Reduce Image
      full_size : true, // Show full size
       download : false, // Download image link
       lightbox : true // lightbox effect
    },

    // texts
    lang : {
      full_size : '<i class="fa fa-external-link"></i> اظهار حجم الصورة الاصلي',
        enlarge : '<i class="fa fa-search-plus"></i> تكبير الصورة',
         reduce : '<i class="fa fa-search-minus"></i> تصغير الصورة',
       download : '<i class="fa fa-download"></i> تحميل الصورة',
       tooltip : 'اضغط لرؤية الصورة كاملة'
    },

    // resize all images inside the "resizeIn" elements
    resize : function() {
      for (var a = $(fa_img_resizer.selector), i = 0, j = a.length; i < j; i++) {
        if (!a[i].alt && (a[i].naturalWidth > fa_img_resizer.max_width || a[i].naturalHeight > fa_img_resizer.max_height)) {
          a[i].className += ' fa_img_reduced';

          // make the image a "link" if it's not wrapper with one
          if (fa_img_resizer.options.lightbox && a[i].parentNode.tagName != 'A') {
            a[i].style.cursor = 'pointer';
            a[i].title = fa_img_resizer.lang.tooltip;

            a[i].onclick = function() {
              fa_img_resizer.lightbox(this);
            };
          }

          // create the resize bar
          if (fa_img_resizer.options.bar) {
            (a[i].parentNode.tagName == 'A' ? a[i].parentNode : a[i]).insertAdjacentHTML('beforebegin',
              '<div class="fa_img_resizer" style="width:' + (a[i].width - 8) + 'px;">'+
                (fa_img_resizer.options.toggler ? '<a class="fa_img_enlarge" href="#" onclick="fa_img_resizer.toggle(this); return false;">' + fa_img_resizer.lang.enlarge + '</a>' : '')+
                (fa_img_resizer.options.full_size ? '<a class="fa_img_full" href="/viewimage.forum?u=' + a[i].src + '" target="_blank">' + fa_img_resizer.lang.full_size + '</a>' : '')+
                (fa_img_resizer.options.download && !/Firefox/.test(navigator.userAgent) && 'download' in document.createElement('A') ? '<a class="fa_img_download" href="' + a[i].src + '" target="_blank" download>' + fa_img_resizer.lang.download + '</a>' : '' )+
              '</div>'
            );
          }
        }
      }
    },

    // toggle between enlarged and reduced image sizes
    toggle : function(that) {
      var img = that.parentNode.nextSibling;

      if (img.tagName == 'A') {
        img = img.getElementsByTagName('IMG')[0];
      }

      if (/fa_img_reduced/.test(img.className)) {
        that.innerHTML = fa_img_resizer.lang.reduce;
        that.className = 'fa_img_reduce';
        img.className = img.className.replace(/fa_img_reduced/, 'fa_img_enlarged');
      } else {
        that.innerHTML = fa_img_resizer.lang.enlarge;
        that.className = 'fa_img_enlarge';
        img.className = img.className.replace(/fa_img_enlarged/, 'fa_img_reduced');
      }

      that.parentNode.style.width = img.width - 8 + 'px';
    },

    // lightbox effect
    lightbox : function(that) {
      var frag = document.createDocumentFragment(),
          overlay = $('<div id="fa_img_lb_overlay" />')[0],
          img = $('<img id="fa_img_lb_image" src="' + that.src + '" />')[0];

      overlay.onclick = fa_img_resizer.kill_lightbox;
      img.onclick = fa_img_resizer.kill_lightbox;

      frag.appendChild(overlay);
      frag.appendChild(img);
      document.body.appendChild(frag);
      document.body.style.overflow = 'hidden';

      img.style.marginTop = '-' + (img.height / 2) + 'px';
      img.style.marginLeft = '-' + (img.width / 2) + 'px';
    },

    // kill the lightbox
    kill_lightbox : function() {
      var overlay = document.getElementById('fa_img_lb_overlay'),
          img = document.getElementById('fa_img_lb_image');

      overlay && document.body.removeChild(overlay);
      img && document.body.removeChild(img);
      document.body.style.overflow = '';
    }
  };

  // write styles into the document head
  document.write(
    '<style type="text/css">'+
      fa_img_resizer.selector + ', .fa_img_reduced { max-width:' + fa_img_resizer.max_width + 'px; max-height:' + fa_img_resizer.max_height + 'px; }'+
      '.fa_img_enlarged { max-width:100% !important; max-height:100% !important; }'+
      '.fa_img_resizer { font-size:12px; text-align:right; padding:3px; margin:3px 0; background:#FFF; border:1px solid #CCC; }'+
      '.fa_img_resizer a { margin:0 3px; }'+
      '.fa_img_resizer i { font-size:14px; vertical-align:middle; }'+
      '#fa_img_lb_overlay { background:rgba(0, 0, 0, 0.7); position:fixed; top:0; right:0; bottom:0; left:0; z-index:999999; cursor:pointer; }'+
      '#fa_img_lb_image { max-height:100%; max-width:100%; position:fixed; left:50%; top:50%; z-index:9999999; cursor:pointer; }'+
    '</style>'
  );

  // begin modifying images when the page is loaded
  $(window).load(fa_img_resizer.resize);

  // kill forumactif's image resizer
  if (window.resize_images) {
    window.resize_images = function() {
      return false;
    };
  }
}());


/* -- toolip - تلميحات -- */
!function(t){function i(t){(t.attr("title")||"string"!=typeof t.attr("original-title"))&&t.attr("original-title",t.attr("title")||"").removeAttr("title")}function e(e,s){this.$element=t(e),this.options=s,this.enabled=!0,i(this.$element)}e.prototype={show:function(){var i=this.getTitle();if(i&&this.enabled){var e=this.tip();e.find(".tipsy-inner")[this.options.html?"html":"text"](i),e[0].className="tipsy",e.remove().css({top:0,left:0,visibility:"hidden",display:"block"}).appendTo(document.body);var s,n=t.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight}),o=e[0].offsetWidth,l=e[0].offsetHeight,a="function"==typeof this.options.gravity?this.options.gravity.call(this.$element[0]):this.options.gravity;switch(a.charAt(0)){case"n":s={top:n.top+n.height+this.options.offset,left:n.left+n.width/2-o/2};break;case"s":s={top:n.top-l-this.options.offset,left:n.left+n.width/2-o/2};break;case"e":s={top:n.top+n.height/2-l/2,left:n.left-o-this.options.offset};break;case"w":s={top:n.top+n.height/2-l/2,left:n.left+n.width+this.options.offset}}2==a.length&&("w"==a.charAt(1)?s.left=n.left+n.width/2-15:s.left=n.left+n.width/2-o+15),e.css(s).addClass("tipsy-"+a),this.options.fade?e.stop().css({opacity:0,display:"block",visibility:"visible"}).animate({opacity:this.options.opacity}):e.css({visibility:"visible",opacity:this.options.opacity})}},hide:function(){this.options.fade?this.tip().stop().fadeOut(function(){t(this).remove()}):this.tip().remove()},getTitle:function(){var t,e=this.$element,s=this.options;i(e);var t,s=this.options;return"string"==typeof s.title?t=e.attr("title"==s.title?"original-title":s.title):"function"==typeof s.title&&(t=s.title.call(e[0])),t=(""+t).replace(/(^\s*|\s*$)/,""),t||s.fallback},tip:function(){return this.$tip||(this.$tip=t('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>')),this.$tip},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled}},t.fn.tipsy=function(i){function s(s){var n=t.data(s,"tipsy");return n||(n=new e(s,t.fn.tipsy.elementOptions(s,i)),t.data(s,"tipsy",n)),n}function n(){var t=s(this);t.hoverState="in",0==i.delayIn?t.show():setTimeout(function(){"in"==t.hoverState&&t.show()},i.delayIn)}function o(){var t=s(this);t.hoverState="out",0==i.delayOut?t.hide():setTimeout(function(){"out"==t.hoverState&&t.hide()},i.delayOut)}if(i===!0)return this.data("tipsy");if("string"==typeof i)return this.data("tipsy")[i]();if(i=t.extend({},t.fn.tipsy.defaults,i),i.live||this.each(function(){s(this)}),"manual"!=i.trigger){var l=i.live?"live":"bind",a="hover"==i.trigger?"mouseenter":"focus",h="hover"==i.trigger?"mouseleave":"blur";this[l](a,n)[l](h,o)}return this},t.fn.tipsy.defaults={delayIn:0,delayOut:0,fade:!1,fallback:"",gravity:"n",html:!1,live:!1,offset:0,opacity:.8,title:"title",trigger:"hover"},t.fn.tipsy.elementOptions=function(i,e){return t.metadata?t.extend({},e,t(i).metadata()):e},t.fn.tipsy.autoNS=function(){return t(this).offset().top>t(document).scrollTop()+t(window).height()/2?"s":"n"},t.fn.tipsy.autoWE=function(){return t(this).offset().left>t(document).scrollLeft()+t(window).width()/2?"e":"w"}}(jQuery);


jQuery( document ).ready(function() {
	jQuery("a").tipsy({gravity:"se",delayIn:0,delayOut:0,fade:1});
	jQuery('head').append('<style type="text/css">.tipsy { padding: 5px; font-size: 10px; position: absolute; z-index: 100000; }</style>');
});





/* --  emoji  -- */ 
jQuery(function ($) {

    'use strict';

    if (!$.sceditor) {
        return;
    }


    // https://twitter.github.io/twemoji/preview.html

    // var emoji = document.getElementsByClassName('emoji'),
    //     list = '';
    // for (var i = 0; i < emoji.length; i++) {
    //     list += ' ' + emoji[i].src.match(/([^\/]+)\.png$/)[1];
    // };
    // console.log(list);

    // 872 emoji


    var button_title = 'Emojis',
        emoji_size = 16, // 16, 36, or 72
        emoji_list = '1f600 1f601 1f602 1f603 1f604 1f605 1f606 1f607 1f608 1f609 1f60a 1f60b 1f60c 1f60d 1f60e 1f60f 1f610 1f611 1f612 1f613 1f614 1f615 1f616 1f617 1f618 1f619 1f61a 1f61b 1f61c 1f61d 1f61e 1f61f 1f620 1f621 1f622 1f623 1f624 1f625 1f626 1f627 1f628 1f629 1f62a 1f62b 1f62c 1f62d 1f62e 1f62f 1f630 1f631 1f632 1f633 1f634 1f635 1f636 1f637 263a 1f638 1f639 1f63a 1f63b 1f63c 1f63d 1f63e 1f63f 1f640 1f645 1f646 1f647 1f648 1f649 1f64a 1f64b 1f64c 1f64d 1f64e 1f64f 1f300 1f301 1f302 1f303 1f304 1f305 1f306 1f307 1f308 1f309 1f30a 1f30b 1f30c 1f30d 1f30e 1f30f 1f310 1f311 1f312 1f313 1f314 1f315 1f316 1f317 1f318 1f319 1f31a 1f31b 1f31c 1f31d 1f31e 1f31f 1f320 1f330 1f331 1f332 1f333 1f334 1f335 1f337 1f338 1f339 1f33a 1f33b 1f33c 1f33d 1f33e 1f33f 1f340 1f341 1f342 1f343 1f344 1f345 1f346 1f347 1f348 1f349 1f34a 1f34b 1f34c 1f34d 1f34e 1f34f 1f350 1f351 1f352 1f353 1f354 1f355 1f356 1f357 1f358 1f359 1f35a 1f35b 1f35c 1f35d 1f35e 1f35f 1f360 1f361 1f362 1f363 1f364 1f365 1f366 1f367 1f368 1f369 1f36a 1f36b 1f36c 1f36d 1f36e 1f36f 1f370 1f371 1f372 1f373 1f374 1f375 1f376 1f377 1f378 1f379 1f37a 1f37b 1f37c 1f380 1f381 1f382 1f383 1f384 1f385 1f386 1f387 1f388 1f389 1f38a 1f38b 1f38c 1f38d 1f38e 1f38f 1f390 1f391 1f392 1f393 1f3a0 1f3a1 1f3a2 1f3a3 1f3a4 1f3a5 1f3a6 1f3a7 1f3a8 1f3a9 1f3aa 1f3ab 1f3ac 1f3ad 1f3ae 1f3af 1f3b0 1f3b1 1f3b2 1f3b3 1f3b4 1f3b5 1f3b6 1f3b7 1f3b8 1f3b9 1f3ba 1f3bb 1f3bc 1f3bd 1f3be 1f3bf 1f3c0 1f3c1 1f3c2 1f3c3 1f3c4 1f3c6 1f3c7 1f3c8 1f3c9 1f3ca 1f3e0 1f3e1 1f3e2 1f3e3 1f3e4 1f3e5 1f3e6 1f3e7 1f3e8 1f3e9 1f3ea 1f3eb 1f3ec 1f3ed 1f3ee 1f3ef 1f3f0 1f400 1f401 1f402 1f403 1f404 1f405 1f406 1f407 1f408 1f409 1f40a 1f40b 1f40c 1f40d 1f40e 1f40f 1f410 1f411 1f412 1f413 1f414 1f415 1f416 1f417 1f418 1f419 1f41a 1f41b 1f41c 1f41d 1f41e 1f41f 1f420 1f421 1f422 1f423 1f424 1f425 1f426 1f427 1f428 1f429 1f42a 1f42b 1f42c 1f42d 1f42e 1f42f 1f430 1f431 1f432 1f433 1f434 1f435 1f436 1f437 1f438 1f439 1f43a 1f43b 1f43c 1f43d 1f43e 1f440 1f442 1f443 1f444 1f445 1f446 1f447 1f448 1f449 1f44a 1f44b 1f44c 1f44d 1f44e 1f44f 1f450 1f451 1f452 1f453 1f454 1f455 1f456 1f457 1f458 1f459 1f45a 1f45b 1f45c 1f45d 1f45e 1f45f 1f460 1f461 1f462 1f463 1f464 1f465 1f466 1f467 1f468 1f469 1f46a 1f46b 1f46c 1f46d 1f46e 1f46f 1f470 1f471 1f472 1f473 1f474 1f475 1f476 1f477 1f478 1f479 1f47a 1f47b 1f47c 1f47d 1f47e 1f47f 1f480 1f481 1f482 1f483 1f484 1f485 1f486 1f487 1f488 1f489 1f48a 1f48b 1f48c 1f48d 1f48e 1f48f 1f490 1f491 1f492 1f493 1f494 1f495 1f496 1f497 1f498 1f499 1f49a 1f49b 1f49c 1f49d 1f49e 1f49f 1f4a0 1f4a1 1f4a2 1f4a3 1f4a4 1f4a5 1f4a6 1f4a7 1f4a8 1f4a9 1f4aa 1f4ab 1f4ac 1f4ad 1f4ae 1f4af 1f4b0 1f4b1 1f4b2 1f4b3 1f4b4 1f4b5 1f4b6 1f4b7 1f4b8 1f4b9 1f4ba 1f4bb 1f4bc 1f4bd 1f4be 1f4bf 1f4c0 1f4c1 1f4c2 1f4c3 1f4c4 1f4c5 1f4c6 1f4c7 1f4c8 1f4c9 1f4ca 1f4cb 1f4cc 1f4cd 1f4ce 1f4cf 1f4d0 1f4d1 1f4d2 1f4d3 1f4d4 1f4d5 1f4d6 1f4d7 1f4d8 1f4d9 1f4da 1f4db 1f4dc 1f4dd 1f4de 1f4df 1f4e0 1f4e1 1f4e2 1f4e3 1f4e4 1f4e5 1f4e6 1f4e7 1f4e8 1f4e9 1f4ea 1f4eb 1f4ec 1f4ed 1f4ee 1f4ef 1f4f0 1f4f1 1f4f2 1f4f3 1f4f4 1f4f5 1f4f6 1f4f7 1f4f9 1f4fa 1f4fb 1f4fc 1f500 1f501 1f502 1f503 1f504 1f505 1f506 1f507 1f508 1f509 1f50a 1f50b 1f50c 1f50d 1f50e 1f50f 1f510 1f511 1f512 1f513 1f514 1f515 1f516 1f517 1f518 1f519 1f51a 1f51b 1f51c 1f51d 1f51e 1f51f 1f520 1f521 1f522 1f523 1f524 1f525 1f526 1f527 1f528 1f529 1f52a 1f52b 1f52c 1f52d 1f52e 1f52f 1f530 1f531 1f532 1f533 1f534 1f535 1f536 1f537 1f538 1f539 1f53a 1f53b 1f53c 1f53d 1f550 1f551 1f552 1f553 1f554 1f555 1f556 1f557 1f558 1f559 1f55a 1f55b 1f55c 1f55d 1f55e 1f55f 1f560 1f561 1f562 1f563 1f564 1f565 1f566 1f567 1f5fb 1f5fc 1f5fd 1f5fe 1f5ff 1f680 1f681 1f682 1f683 1f684 1f685 1f686 1f687 1f688 1f689 1f68a 1f68b 1f68c 1f68d 1f68e 1f68f 1f690 1f691 1f692 1f693 1f694 1f695 1f696 1f697 1f698 1f699 1f69a 1f69b 1f69c 1f69d 1f69e 1f69f 1f6a0 1f6a1 1f6a2 1f6a3 1f6a4 1f6a5 1f6a6 1f6a7 1f6a8 1f6a9 1f6aa 1f6ab 1f6ac 1f6ad 1f6ae 1f6af 1f6b0 1f6b1 1f6b2 1f6b3 1f6b4 1f6b5 1f6b6 1f6b7 1f6b8 1f6b9 1f6ba 1f6bb 1f6bc 1f6bd 1f6be 1f6bf 1f6c0 1f6c1 1f6c2 1f6c3 1f6c4 1f6c5 203c 2049 2122 2139 2194 2195 2196 2197 2198 2199 21a9 21aa 23-20e3 231a 231b 23e9 23ea 23eb 23ec 23f0 23f3 24c2 25aa 25ab 25b6 25c0 25fb 25fc 25fd 25fe 2600 2601 260e 2611 2614 2615 261d 2648 2649 264a 264b 264c 264d 264e 264f 2650 2651 2652 2653 2660 2663 2665 2666 2668 267b 267f 2693 26a0 26a1 26aa 26ab 26bd 26be 26c4 26c5 26ce 26d4 26ea 26f2 26f3 26f5 26fa 26fd 2702 2705 2708 2709 270a 270b 270c 270f 2712 2714 2716 2728 2733 2734 2744 2747 274c 274e 2753 2754 2755 2757 2764 2795 2796 2797 27a1 27b0 27bf 2934 2935 2b05 2b06 2b07 2b1b 2b1c 2b50 2b55 30-20e3 3030 303d 31-20e3 32-20e3 3297 3299 33-20e3 34-20e3 35-20e3 36-20e3 37-20e3 38-20e3 39-20e3 a9 ae e50a 1f004 1f0cf 1f170 1f171 1f17e 1f17f 1f18e 1f191 1f192 1f193 1f194 1f195 1f196 1f197 1f198 1f199 1f19a 1f1e6 1f1e7 1f1e8-1f1f3 1f1e8 1f1e9-1f1ea 1f1e9 1f1ea-1f1f8 1f1ea 1f1eb-1f1f7 1f1eb 1f1ec-1f1e7 1f1ec 1f1ed 1f1ee-1f1f9 1f1ee 1f1ef-1f1f5 1f1ef 1f1f0-1f1f7 1f1f0 1f1f1 1f1f2 1f1f3 1f1f4 1f1f5 1f1f6 1f1f7-1f1fa 1f1f7 1f1f8 1f1f9 1f1fa-1f1f8 1f1fa 1f1fb 1f1fc 1f1fd 1f1fe 1f1ff 1f201 1f202 1f21a 1f22f 1f232 1f233 1f234 1f235 1f236 1f237 1f238 1f239 1f23a 1f250 1f251'.split(' '),


        listLength = emoji_list.length,
        index = 0,
        disable = false,
        $win = $(window),
        addResizeEvent;

    function createList($wrap) {
        disable = true;

        var stop = index + 100;

        if (stop > listLength) {
            stop = listLength;
        }

        for (index; index < stop; index++) {
            var element = emoji_list[index],
                $item = $('<img>', {
                    'class': 'emoji',
                    alt: element,
                    src: 'http://twemoji.maxcdn.com/' + emoji_size + 'x' + emoji_size + '/' + element + '.png'
                });
            $item.appendTo($wrap);
        }

        index = stop;
        disable = false;
    }

    function updatePosition($wrap, caller) {
        var callerLeft = caller.offset().left,
            winWidth = $win.width(),
            customStyle = {
                top: caller.offset().top,
                marginTop: caller.outerHeight()
            };

        if (callerLeft + 260 > winWidth) {
            customStyle.left = 'auto';
            customStyle.right = 0;
        } else {
            customStyle.left = callerLeft;
            customStyle.right = 'auto';
        }
        $wrap.css(customStyle);
    }

    $('head').append($('<style>', {
        text: '.sceditor-button-twemoji div{background:url(http://twemoji.maxcdn.com/16x16/1f600.png)!important}.sceditor-twemoji{width:260px;height:250px;overflow-y:auto}.sceditor-twemoji img{cursor:pointer;margin:7px;width:16px;height:16px;overflow:hidden;text-indent:-99px}.sceditor-twemoji img:hover{opacity:.7}'
    }));

    // create sceditor button and drop down
    $.sceditor.command.set('twemoji', {
        emoji: function (editor, caller, callback) {

            var $wrap = $('.sceditor-twemoji'),
                closeDropDown = editor.closeDropDown;

            if (!$wrap.length) {

                closeDropDown();
                editor.closeDropDown = function() {
                    closeDropDown.apply(closeDropDown, arguments);
                    if ($wrap.is(":visible")) {
                        $wrap.hide();
                    }
                };

                $wrap = $('<div>', {
                    'class': 'sceditor-dropdown sceditor-twemoji'
                }).click(function (e) {
                    e.stopPropagation();
                });
                $wrap.appendTo('body');

                createList($wrap);
                $wrap.scrollTop(0);

                $wrap.on('click', '.emoji', function (e) {
                    callback(this.src);
                    if (!e.ctrlKey) {
                        $wrap.hide();
                    }
                });

                $wrap.scroll(function () {
                    if (disable) {
                        return false;
                    }
                    if (index >= emoji_list.length) {
                        return false;
                    }
                    if ($wrap.scrollTop() + 250 + 50 < $wrap[0].scrollHeight) {
                        return false;
                    }
                    createList($wrap);
                });

            } else {

                if ($wrap.is(":hidden")) {
                    editor.closeDropDown();
                    $wrap.show();
                } else {
                    editor.closeDropDown();
                }

            }

            updatePosition($wrap, caller);
            if (!addResizeEvent) {
                addResizeEvent = true;
                $win.resize(function () {
                    updatePosition($wrap, caller);
                });
            }

        },

        // wysiwyg
        exec: function (caller) {
            var editor = this;
            $.sceditor.command.get('twemoji').emoji(editor, caller, function (icon) {
                editor.insert('&nbsp;[img]' + icon + '[/img]&nbsp;', '', true, true, true);
            });
        },

        // source
        txtExec: function (caller) {
            var editor = this;
            $.sceditor.command.get('twemoji').emoji(editor, caller, function (icon) {
                editor.insert(' [img]' + icon + '[/img] ', '', true, true, true);
            });
        },

        tooltip: button_title
    });

    toolbar = toolbar.replace(/date,/, 'twemoji,date,'); // add the button to the toolbar

});


/* -- user info -- */

  $(function() {
    $.each(_userdata, function(a, b) {
        $(".Ahla-" + a).html(b)
    })
}), $(document).ready(function() {
    $(".ksuserlink").html('<a href="/u' + _userdata.user_id + '"><i class="fa fa-user ulfa" aria-hidden="true"></i>  &#1575;&#1604;&#1605;&#1604;&#1601; &#1575;&#1604;&#1588;&#1582;&#1589;&#1610; </a>')
});


/* -- Tawk online support system -- */
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/5790f8558642ec804b75c6c9/1ao80tasr';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();

/* remove parenthesis on notifications */

         $(function(){
                setInterval(function () {
                    $("#notif_unread").length && $("#notif_unread").text(function (d, c) {
                      return c.replace(/\(|\)/g, "")
                    })
                  }, 200);
                });




/* notifcation popup */
(function() {
          var version = 1;
          /* COMPATIBLE FORUM VERSIONS
          ** 0 : PHPBB2
          ** 1 : PHPBB3
          ** 2 : PUNBB
          ** 3 : INVISION
          */
         
          if (!window.FA) window.FA = {};
          if (FA.Popup) {
            if (window.console) console.warn('FA.Popup has already been initialized.');
            return;
          }
         
          FA.Popup = {
         
            lang : {
              button_close : 'X',
              default_title : 'Popup',
              loading : 'يتم التحميل ...',
         
              error_getPage : 'حدث خطأ أثناء ارسال الطلب ، يرجى المحاولة لاحقا',
              error_connection : 'خطأ في الوصول للانترنت ، يرجى التحقق من الانترنت و المحاولة مرة اخرى '
            },
           
            active : false,
           
            forum : {
              version : version,
              content : version ? '#main-content' : '#content-container > table > tbody > tr > td[width="100%"]',
              pages : ['.gensmall:has(.sprite-arrow_subsilver_left, .sprite-arrow_subsilver_right) a[href^="/"], .nav:has(.sprite-arrow_subsilver_left, .sprite-arrow_subsilver_right) a[href^="/"]', '.pagination:not(strong) span a', '.paging a[href^="/"]', '.pagination a[href^="/"]'][version]
            },
           
            /* open a new popup window */
            open : function(href, title, callback) {
              if (FA.Popup.active) FA.Popup.close(); // close opened windows
             
              var box = document.createElement('DIV'),
                  overlay = document.createElement('DIV'),
                  content = document.createElement('DIV'),
                  close = document.createElement('INPUT');
         
              close.type = 'button';
              close.value = FA.Popup.lang.button_close;
              close.className = 'fa_popup_button fa_popup_close';
              close.onclick = FA.Popup.close;
         
              content.id = 'fa_popup_content';
              content.innerHTML = '<div class="fa_popup_loading">' + FA.Popup.lang.loading + '</div>';
             
              overlay.id = 'fa_popup_overlay';
              overlay.style.zIndex = '99998';
              overlay.onclick = FA.Popup.close;
         
              if (FA.Popup.forum.version == 2) box.className += ' pun';
              box.id = 'fa_popup';
              box.style.zIndex = '99999';
              box.innerHTML = '<div class="fa_popup_title">' + (title ? title : FA.Popup.lang.default_title) + '</div>';
              box.appendChild(close);
              box.appendChild(content);
         
              if (href) {
                $.get(href, function(data) {
                  content.innerHTML = '';
                  if (callback) callback(data, content);
                  else {
                    var main = $(FA.Popup.forum.content, data)[0];
                    if (main) {
                      content.appendChild(main);
         
                      var page = $(FA.Popup.forum.pages, content);
                      if (page[0]) page.click(FA.Popup.getPage);
                    }
                  }
                }).fail(function() {
                  content.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_connection + '</div>';
                });
              } else if (callback) {
                content.innerHTML = '';
                callback(content);
              }
         
              document.body.style.overflow = 'hidden';
              document.body.appendChild(overlay);
              document.body.appendChild(box);
             
              FA.Popup.active = true;
            },
           
            /* close an opened popup window */
            close : function () {
              var box = document.getElementById('fa_popup'),
                  overlay = document.getElementById('fa_popup_overlay');
             
              box && document.body.removeChild(box);
              overlay && document.body.removeChild(overlay);
              document.body.style.overflow = '';
             
              FA.Popup.active = false;
            },
         
           
            /* get the page when a pagination link is clicked */
            getPage : function() {
              var content = document.getElementById('fa_popup_content');
         
              $.get(this.href, function(data) {
                var main = $(FA.Popup.forum.content, data)[0], page;
         
                if (main) {
                  content.scrollTop = 0;
                  content.innerHTML = '';
                  content.appendChild(main);
                 
                  page = $(FA.Popup.forum.pages, content);
                  if (page[0]) page.click(FA.Popup.getPage);
                } else {
                  content.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_getPage + '</div>';
                }
              }).fail(function() {
                content.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_connection + '</div>' ;
              });
              return false;
            }
           
          };
        })();


        $(function(){$(function(){
          if (!FA.Popup) return;
         
          // popup config
          FA.Popup.notif_config = {
            PMs : true,
            VMs : true,
            Groups : true,
            Replies : true,
            Reports : true,
            Requests : true
          };
         
          // language config
          var lang = {
            viewing_pm : 'رسالة جديد من : ',
            viewing_wall : 'عرض رسائل الزوار',
            viewing_reply : 'رد جديد بواسطة : ',
            viewing_request : 'عرض طلبات الأصدقاء',
            viewing_group : 'Viewing group',
            viewing_report : 'عرض التقارير',
           
            more_pm : 'معاينة جميع الرسائل',
            more_wall : 'زيارة حائط التعاليق الخاص بحسابي',
            more_reply : 'عرض الرد في الاعلان',
            more_request : 'عرض قائمة الأصدقاء و المحظورين',
            more_group : 'اعرض المجموعة',
            more_report : 'عرض كل التقارير',
           
            friend_added : 'Added',
            friend_denied : 'Denied',
            friend_error : 'خطأ',
           
            error_no_pm : '<b>خطأ :</b> الرسالة التي تحاول الوصول اليها غير موجودة',
            error_no_wall : '<b>خطأ :</b>  Your wall could not be accessed. Please try using the button below to view your wall.',
            error_no_reply : '<b>خطأ :</b> التعليق الذي تحاول الوصول اليه غير موجود',
            error_no_requests : '<b>خطأ :</b>  لم يتم الوصول لطلب الصداقة هذا',
            error_no_group : '<b>خطأ :</b>  المجموعة التي تحاول الوصول اليها غير موجودة',
            error_no_report : '<b>خطأ :</b>  The report page could not be accessed. Please try using the button below to access it.'
          },
          notif = document.getElementById('notif_list'), i;
         
         
          if (notif) {
            $(notif).click(function(e) {
              var node = e.target, store, id, sender, more = document.createElement('DIV');
              more.className = 'fa_popup_more';
             
              if (node.tagName == 'A') {
                id = node.parentNode.parentNode.parentNode.id.slice(1); // notif id
                store = FA.Notification.getStore(); // notif data
                sender = store[id].text.from.name; // username of sender
               
                // PMs
                if (/\/privmsg/.test(node.href) && FA.Popup.notif_config.PMs) {
                  FA.Popup.open('/privmsg?folder=inbox&mode=read&p=' + store[id].text.msg_id + '&nid=' + id, FA.Popup.lang.viewing_pm + sender, function(data, popup) {
                    var PM = $('form[action^="/privmsg"]:has(.postbody)', data)[0];
                    if (PM) popup.appendChild(PM);
                    else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_pm + '</div>';
                   
                    more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_pm + '</a>';
                    popup.appendChild(more);
                  });
                  e.preventDefault();
                }
               
                // Replies
                else if (/\/t\d+/.test(node.href) && FA.Popup.notif_config.Replies) {
                  FA.Popup.open(node.href, FA.Popup.lang.viewing_reply + sender, function(data, popup) {
                    var reply = $('.post--' + store[id].text.post.post_id, data)[0];
                   
                    if (reply) popup.appendChild(reply);
                    else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_reply + '</div>';
                   
                    more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_reply + '</a>';
                    popup.appendChild(more);
                  });
                  e.preventDefault();
                }
               
                // Visitor Messages
                else if (/\/u\d+wall/.test(node.href) && FA.Popup.notif_config.VMs) {
                  FA.Popup.open(node.href, FA.Popup.lang.viewing_wall, function(data, popup) {
                    var wall = $('#profile-advanced-details', data)[0];
                    if (wall) popup.appendChild(wall);
                    else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_wall + '</div>';
                   
                    more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_wall + '</a>';
                    popup.appendChild(more);
                  });
                  e.preventDefault();
                }
               
                // Friend requests
                else if (/page_profil=friendsfoes/.test(node.href) && FA.Popup.notif_config.Requests) {
                  FA.Popup.open(node.href, FA.Popup.lang.viewing_request, function(data, popup) {
                    var request = $((FA.Popup.forum.version == 2 ? '.main-content.frm dd' : '.friends-foes-list') + ':has(a[href^="/profile?deny"])', data);
                    if (request[0]) {
                      $(request).addClass('fa_popup_friends');
                     
                      // accept / deny requests using AJAX
                      $('a[href^="/profile"]', request).click(function() {
                        var t = this, add = /deny/.test(t.href) ? 0 : 1;
                       
                        $('a[href^="/profile"]', t.parentNode).hide();
                       
                        // success / error messages
                        $.get(t.href, function() {
                          $(t.parentNode).append('<strong class="' + (add ? 'add' : 'deny') + '_success">' + (add ? FA.Popup.lang.friend_added : FA.Popup.lang.friend_denied) + '</strong>');
                        }).fail(function() {
                          $(t.parentNode).append('<strong class="add_failed">' + FA.Popup.lang.friend_error + '</strong>');
                        });
                       
                        return false;
                      });
                     
                      $(popup).append(request);
                    }
                    else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_requests + '</div>';
                   
                    more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_request + '</a>';
                    popup.appendChild(more);
                  });
                  e.preventDefault();
                }
               
                // Group requests
                else if (/\/g\d+-/.test(node.href) && FA.Popup.notif_config.Groups) {
                  FA.Popup.open(node.href, FA.Popup.lang.viewing_group, function(data, popup) {
                    var group = $('form[name="post"]', data)[0];
                    if (group) popup.appendChild(group);
                    else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_group + '</div>';
                   
                    more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_group + '</a>';
                    popup.appendChild(more);
                  });
                  e.preventDefault();
                }
               
                // Reports
                else if (/\/report/.test(node.href) && FA.Popup.notif_config.Reports) {
                  FA.Popup.open(node.href, FA.Popup.lang.viewing_report, function(data, popup) {
                    var report = $(FA.Popup.forum.content, data)[0];
                    if (report) popup.appendChild(report);
                    else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_report + '</div>';
                   
                    more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_report + '</a>';
                    popup.appendChild(more);
                  });
                  e.preventDefault();
                }
              }
            });
           
            for (i in lang) FA.Popup.lang[i] = lang[i]; // add language config to popup object
          }
        })});


// search 

        $(function() {
          if (!window.FA.Popup) return;
         
          $('form[action^="/search"]').submit(function(e) {
            var keywords = this.search_keywords;
           
            FA.Popup.open('/search?' + $(this).serialize(), 'نتيجة البحث' + (keywords.value ? ' : ' + keywords.value : ''));
           
            keywords.blur();
            e.preventDefault();
          });
        });


/* Private Message list */
jQuery(function () {
            /***
            * User Definition Variables
            ***/
            /* Put here the amount number of PMs returned!!! */
            var iAmount = 10;   
            /***
            * System Defined Variables - Do not edit if you don't know!
            ***/
            var oConfig = {
    
                sContent:
                    '<div class="ipsHeaderMenu boxShadow" id="user_inbox_link_menucontent" style="display: none; width: 300px; position: fixed; z-index: 10; top: 58px;left: 477px;">' +
                        '<h4 class="ipsType_sectiontitle">صندوق الرسائل' +
                            '<p class="ipsPad_half ipsType_smaller right">' +
                                '<a class="configure" href="/privmsg?folder=inbox">معاينة كل الرسائل</a> · <a href="/privmsg?mode=post">ارسل رسالة جديدة</a>' +
                            '</p>' +
                        '</h4>' +
                        '<ul class="ipsList_withminiphoto"><i class="fa fa-refresh fa-spin fa-fw"  style="display: block; margin-left: auto; margin-right: auto;"></i></ul>' +
                    '</div>',       
 
                sTarget: '',
                sSearch: '',
                sExpression0: '',
                sExpression1: '',
                sExpression2: '',
                sGetIMG: ''
            };
         
            /* Add CSS */
            /*document.head.insertAdjacentHTML('beforeEnd', oConfig.sCSS);*/
             jQuery('body').append( oConfig.sContent);
             /* Forum versions! */
            var phpBB2 = jQuery('.bodyline');
            var phpBB3 = jQuery('#wrapper');
            var punbb = jQuery('#pun-intro');
            var invision = jQuery('#ipbwrapper');
           
            if (phpBB2.length) {
                oConfig.sSearch = 'form[name="privmsg_list"] .forumline tr';
                oConfig.sTarget = 'tr';
                oConfig.sExpression0 = 'memDiv.find("tr:first, tr:last").remove();';
                oConfig.sExpression1 = 'jQuery(this).find("a.topictitle").html()';
                oConfig.sExpression2 = 'jQuery(this).find("td .name").html() + " - " + jQuery(this).find("td .postdetails").html()';
                oConfig.sGetIMG = ' #emptyidcc .row1.gensmall img:eq(0)';
            } else if(phpBB3.length) {
                oConfig.sSearch = '.topiclist.pmlist.bg_none .forum-block';
                oConfig.sTarget = '.forum-block-inner div.forum-info';
                oConfig.sExpression1 = 'jQuery(this).find("a.topictitle")[0].outerHTML';
                oConfig.sExpression2 = 'jQuery(this).find("em").html()';
                oConfig.sGetIMG = ' #profile-advanced-right img:eq(0)';
            } else if(punbb.length) {
                oConfig.sSearch = '.main-content tr .tcl.tdtopics';
                oConfig.sGetIMG = ' #profile-advanced-right .main-content img:first';
            } else if(invision.length) {
                oConfig.sSearch = '.borderwrap table.ipbtable tbody tr:not(":empty")';
                oConfig.sTarget = 'tr';
                oConfig.sExpression1 = 'var _tmp1 = jQuery(this).find("td:eq(2)");_tmp1.children("a.topictitle")[0].outerHTML';
                oConfig.sExpression2 = '_tmp1.children("a.topictitle").remove();_tmp1.html()';
                oConfig.sGetIMG = ' #profile-advanced-right .box-content.profile.center img:first';
            };
           
            jQuery('a#privmsg-menu').click(function () {
                var oClicked = jQuery(this);
                var oTarget = jQuery('#user_inbox_link_menucontent');
         
                if (oTarget[0].style.display == 'none') {
                    oClicked.addClass('menu_active');
                   
                    if ( !oTarget.find('ul.ipsList_withminiphoto > li').length ) {
                        var memDiv = jQuery('<div>');
                        memDiv.load('/privmsg?folder=inbox ' + oConfig.sSearch + ':lt(' + iAmount + ')', function() {
                            if (punbb.length) {
                                memDiv
                                    .html(
                                        memDiv.html()
                                            .replace(/\<\/a\> por/g, '</a></br><span class="ipsType_smaller desc lighter">')
                                            .replace(/\<\/td\>/g, '</span></div></li>')
                                            .replace(/\<td class="tcl tdtopics"\>/g, '<li class="ipsType_small clearfix"><img class="ipsUserPhoto ipsUserPhoto_mini left" alt="User image" src="http://i78.servimg.com/u/f78/18/17/62/92/defaul10.png"><div class="list_content">')
                                    )
                                    .find('span.status').remove();
                            } else {
                                if (oConfig.sExpression0) {
                                    eval( oConfig.sExpression0 );
                                }
                                var sHtml = '';
                                oConfig.sTarget = memDiv.find(oConfig.sTarget);
                                jQuery.each(oConfig.sTarget, function( index, value ) {
                                    sHtml +=
                                        '<li class="ipsType_small clearfix">' +
                                            '<img class="ipsUserPhoto ipsUserPhoto_mini left" alt="User image" src="http://i78.servimg.com/u/f78/18/17/62/92/defaul10.png">' +
                                            '<div class="list_content">' +
                                                eval( oConfig.sExpression1 ) + '<br>' +
                                                '<span class="ipsType_smaller desc lighter">' + eval( oConfig.sExpression2 ) + '</span>' +
                                            '</div>' +
                                        '</li>';
                                });
                                memDiv.html(sHtml);
                            }
                            oTarget.find('ul.ipsList_withminiphoto').html(memDiv.html());
         
                            var oImgTarget = oTarget.find('.ipsType_small.clearfix');
                            oImgTarget.each(function( index ) {
                                var UserURL = jQuery(this).find('.ipsType_smaller a, .list_content a:last');
         
                                if (UserURL.length) {
                                    UserURL = UserURL.attr('href');
                                    var oImgTag = jQuery(this).find('.ipsUserPhoto');
                                    var UserIMG = sessionStorage.getItem(UserURL); /* Gets the avatar saved in local storage */
         
                                    /* If avatar alread saved, then no request member profile! */
                                    if(UserIMG) {
                                        jQuery(this).find('img').attr('src', UserIMG);
                                    } else {
                                        /* if not, then only request per session!!! */
                                        jQuery.get(UserURL, function(data){
                                            var profile_img = jQuery(oConfig.sGetIMG, data).attr('src');
                                           
                                            if (profile_img !== undefined) {
                                                oImgTag.attr('src', profile_img);
                                                /* Saves the member avatar in local storage */
                                                sessionStorage.setItem(UserURL, profile_img);
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }
                    oTarget           
                        .fadeIn(400);
                    jQuery(document).mousedown(function() {
                        if(!oTarget.is(":hover")) {
                            jQuery(document).unbind('mousedown');
                            oClicked.removeClass('menu_active');
                            oTarget.fadeOut(400);
                        }
                    });           
                } else {
                    oClicked.removeClass('menu_active');
                    oTarget.fadeOut(400);
                }
                return false;
            });
        });
/* user profile on hover */

        $(function() {
          var links = $('a[href^="/u"]'),
              usersinfo = {};
         
          links.tooltipster && links.not('.mentiontag, .tooltipstered').tooltipster({
            animation : 'fade',
            interactive : true,
            contentAsHTML : true,
            minWidth : 300,
            maxWidth : 300,
            delay : 500,
            arrowColor : "#EEE",
            autoClose : true,
            content : 'Loading...',
            functionBefore: function(origin, continueTooltip) {
              continueTooltip();
         
              var userid = $(this).attr('href').replace(/.*?\/u(\d+).*/, '$1');
              if (origin.data('ajax') !== 'cached') {
                if (usersinfo[userid] != undefined) {
                  origin.tooltipster('content', usersinfo[userid]).data('ajax', 'cached');
                } else {
                  $.ajax({
                    type: 'GET',
                    url: "/ajax/index.php",
                    dataType: "html",
                   
                    data: {
                      f: "m",
                      user_id: userid
                    },
         
                    success: function(html) {
                      usersinfo[userid] = html;
                      origin.tooltipster('content', html).data('ajax', 'cached');
                    }
                  });
                }
              }
            }
          });
        });



/* Login / Logout Redirector */
(function() {
          var html_page = 'h12-page',
              link_change = true,
              redirect = true;
         
          $(function() {
            var regex = new RegExp(html_page);
         
            // link change
            if (link_change && !regex.test(window.location.href)) {
              $('a[href^="/login"], a[href^="http://' + window.location.host + '/login"]').attr('href', html_page);
            }
         
            // redirect to classic if login page isn't available
            if (!document.getElementById('fa_form_container') && regex.test(window.location.href)) {
              window.location.href = '/login#login_classic';
            }
          });
         
          // login redirection
          // saves redirect location so you're taken to the correct page upon login
          if (/\/login\?redirect/.test(window.location.href)) {
            my_setcookie('fa_login_form_redirect', window.location.search.replace(/.*?redirect=(.*?)(?:&|$)/, '$1'));
          }
         
          // redirect
          if (redirect && /\/login/.test(window.location.href)) {
            if (/login_classic/.test(window.location.hash) || /admin=1/.test(window.location.href)) return;
            window.location.href = html_page;
          }
        }());


/* imgur upload */

;window['FormData'] && $(function(){$(function(){
           
              var imgur_client_id = 'c0f64da46f9bbd8'; // you will get it via http://api.imgur.com/oauth2/addclient
           
              var current = 0, uploaded, xhrs, file_selector, button = $('.sceditor-button-servimg').off().click(function(){
                if(current) return finish();
                if(!file_selector) file_selector = $('<input type="file" multiple/ accept="image/*">').css({position:'absolute', top:-100}).appendTo('body').change(function (e) {
                  var files = e.target.files, fd, len;
                  uploaded = [], xhrs = [];
                  for (var i = 0, len = files.length; i < len; i += 1) {
                    if (files[i].type.indexOf('image/') && files[i].type !== 'application/pdf') continue;
                    current++;
                    fd = new FormData();
                    fd.append('image', files[i]);
                    (function(xhr){
                      var num = i, xhr = jQuery.ajaxSettings.xhr();
                      xhrs.push(xhr);
                      xhr.open('POST', 'https://api.imgur.com/3/image');
                      xhr.setRequestHeader('Authorization', 'Client-ID '+imgur_client_id);
                      xhr.onreadystatechange = function () {
                        if (xhr.readyState !== 4) return;
                        current--;
                        if (xhr.status === 200) {
                          var res = JSON.parse(xhr.responseText);
                          uploaded[num] = res.data.link;
                        }
                        if(!current) finish();
                      };
                      xhr.send(fd);
                    })();
                  }
                  if(current) button.css({"background":"#ddd url(http://i.imgur.com/EMsOJtZ.gif) no-repeat","width":"22px","height":"19px","margin-top":"1px","margin-right":"-1px"});
                });
                file_selector.click();
                return false;
              }).children();
              var finish = function(){
                for(var i=0; i < xhrs.length; i++) {
                    if(xhrs[i].readyState == 4) continue;
                    xhrs[i].onreadystatechange = function(){};
                    xhrs[i].abort();
                }
                for(var i=0; i < uploaded.length; i++) {
                  if(uploaded[i] === undefined) continue;
                  $('body').find('.sceditor-button-image').click().end().find('.sceditor-insertimage').find('#image').val(uploaded[i]).end().find('input.button').click();
                  $('#text_editor_textarea').sceditor('instance').insertText('\n');
                }
                button.removeAttr('style');
                current = 0;
                file_selector.wrap('<form>').closest('form').get(0).reset();
                file_selector.unwrap();
                return false;
              };
            })});



/* Warning button */
$(function () {
            var modButton = true,
                admButton = true;

            if (_userdata.user_level === 1 && admButton === true) {
                $("#text_editor_textarea").before("<a class='note-btn mod-b'>تنبيه القسم</a>");
                $('.mod-b').click(function () {
                    $('#text_editor_textarea').sceditor('instance').insertText('[wrong]', '[/wrong]')
                });
            }
            if (_userdata.user_level === 1 && admButton === true) {
                $("#text_editor_textarea").before("<a class='note-btn not-b'>تنبيه التكرار</a>");
                $('.not-b').click(function () {
                    $('#text_editor_textarea').sceditor('instance').insertText('[norepeat][/norepeat]')
                });
            }
            if (_userdata.user_level === 1 && modButton === true) {
                $("#text_editor_textarea").before("<a class='note-btn adm-b'>تنبيه الدولة</a>");
                $('.adm-b').click(function () {
                    $('#text_editor_textarea').sceditor('instance').insertText('[location]', '[/location]')
                });
            }
    
            $('div.postbody div').each(function () {
                if ($(this).text().indexOf('[location]') != -1) $(this).html($(this).html().replace(/\[location\](.+?)\[\/location\]/gi, '<div class="mod_mess3"><div class="titl">Administrator Warning</div><div>$1 </div></div>'));
                if ($(this).text().indexOf('[norepeat]') != -1) $(this).html($(this).html().replace(/\[norepeat\](.+?)\[\/norepeat\]/gi, '<div class="mod_mess1"><div class="titl">Moderator Warning</div><div>$1 </div></div>'));
                if ($(this).text().indexOf('[wrong]') != -1) $(this).html($(this).html().replace(/\[wrong\](.+?)\[\/wrong\]/gi, '<div class="mod_mess2"><div class="titl">Moderator Warning</div><div>$1 </div></div>'));
            });
        });


/* country menu */
 jQuery(document).ready(function () {
     function b(a, b) {
         return new RegExp(" " + b + " ").test(" " + a.className + " ")
     }

     function e(a, c) {
         var d = " " + a.className.replace(/[\t\r\n]/g, " ") + " ";
         if (b(a, c)) {
             for (; d.indexOf(" " + c + " ") >= 0;) d = d.replace(" " + c + " ", " ");
             a.className = d.replace(/^\s+|\s+$/g, "")
         } else a.className += " " + c
     }
     var a = document.getElementById("toggle");
     a.onclick = function () {
         return e(this, "on"), !1
     }
 });


/* force WYSIWYG */

$(function() {$(function() {
  var instance = $('#text_editor_textarea').sceditor('instance');
 
  if (instance.inSourceMode()) {
    instance.toggleSourceMode();
  }
})});

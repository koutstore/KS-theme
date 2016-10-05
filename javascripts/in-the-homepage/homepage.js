/* fourm icon */
jQuery(document).ready(function() {
          var a = [];
          a[2] = ["ficon2"];
          a[3] = ["ficon3"];
          a[8] = ["ficon8"];
          a[28] = ["ficon28"];
          a[20] = ["ficon20"];
          a[33] = ["ficon33"];
          a[41] = ["ficon41"];
          a[48] = ["ficon48"];
          a[63] = ["ficon63"];
          a[37] = ["ficon37"];
          a[60] = ["ficon60"];
          a[19] = ["ficon19"];
          a[25] = ["ficon25"];
          a[26] = ["ficon26"];
          a[21] = ["ficon21"];
          a[1] = ["ficon55"];
         
          jQuery("a.forumtitle").each(function() {
            var b = jQuery(this).attr("href").match(/^\/f(\d+)-/)[1];
            void 0 !== a[b] && jQuery(this).closest(".forum-block").find(".forum-icon").attr("class", a[b])
          })
        });

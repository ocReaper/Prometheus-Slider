;(function ($) {

  "use strict";

  if (typeof PrometheusDecorators === 'undefined')
    window.PrometheusDecorators = {};

  var ImageSlice  = {};

  /**
   * This function provides the tile creation and the transition handling as the name says
   */
  ImageSlice.transition = function (e,args) {

    var $container = args[0],
      settings = this.settings,
      image = this.images[args[1]],
      width = $container.width(),
      height = $container.height(),
      $img = $container.find('.tiles'),
      initialized = ($img.find('.tile').length > 0),
      imageBackground = (initialized ? image : $img.css('background-image')),
      n_tiles = settings.cols * settings.rows,
      tiles = [],
      $tiles,
      range = function (min, max, rand) {
        var arr = ( new Array(++max - min) )
          .join('.').split('.')
          .map(function (v, i) {
            return min + i
          });
        return rand
          ? arr.map(function (v) {
          return [ Math.random(), v ]
        })
          .sort().map(function (v) {
            return v[ 1 ]
          })
          : arr;
      },
      createTilesByImage = function () {
        for (var i = 0; i < n_tiles; i++) {
          tiles.push('<div class="tile"></div>');
        }
        $tiles = $(tiles.join(''));
        $tiles.css({
          width: width / settings.cols,
          height: height / settings.rows,
          backgroundImage: imageBackground
        }).css3({
          transition: 'none'
        });
        $img.append($tiles);
        $tiles.each(function () {
          var pos = $(this).position();

          $(this).css('backgroundPosition', -pos.left + 'px ' + -pos.top + 'px');
        });
        $tiles.css3({
          'transition-property': 'all',
          'transition-duration': '.3s',
          'transition-timing-function': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
        });
      },
      animateTilesWithDelay = function () {
        var tilesArr = range(0, n_tiles, settings.random),
          tileSpeed = settings.speed / n_tiles;

        tilesArr.forEach(function (tile, i) {
          $tiles.eq(tile).css3({'transition-delay': ((i * tileSpeed) / 1000) + 's'}).addClass('animate');
        });
      };

    createTilesByImage();
    $img.css('background-image', '');
    animateTilesWithDelay();
  };

  /**
   * Replaces every <img/> tag to a <div/> with a background image
   */
  ImageSlice.turnImagesIntoContainers = function () {
    var _this = this,
      i = 0;

    this.images = [];

    this.$slides.each(function () {
      var $slide = $(this),
        $img = $slide.find('img[data-role=background]'),
        $tiles = $('<div class="tiles"></div>');

      if (!$img.length) {
        _this.images[i] = '';
        i++;
        return;
      }

      $img.hide();
      $slide.append($tiles);
      $tiles.css('background-image', 'url(' + $img.attr('src') + ')');
      if ($img.data()) $tiles.data($img.data());
      if (!!$img.attr('class')) $tiles.addClass($img.attr('class'));
      _this.images[i] = $tiles.css('background-image');
      $img.remove();
      i++;
    });
  };

  PrometheusDecorators.imageSlice = function(){
    $.subscribe('preInit', ImageSlice.turnImagesIntoContainers());
    $.subscribe('onTransition', ImageSlice.transition());
    $.subscribe('afterTransition', function(){
      $currentSlide.find('.tiles').css('background-image', _this.images[currentPos]);
      $currentSlide.find('.tile').remove();
    });
  }

})(jQuery);
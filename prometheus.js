;(function (window, $, undefined) {
  "use strict";

  /**
   * This function provides the tile creation and the transition handling as the name says
   * @param {string} way The way of the transition (= in/out)
   * @param {Object} settings The animation perferences given by this.settings.animation
   * @param {string} activeClass The activeClass from this.settings
   * @param {string} image The url of the image get by jQuery like "url(http://domain.com/assets/slide1.jpg)"
   */
  $.fn.transition = function (way, settings, activeClass, image) {

    var $container = $(this),
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
   * Creator of magic, constructor of Prometheus
   * @param {Object} $slider Requires a jQuery node
   * @param {Object=} options An optional object of options to override the defaults
   * @constructor
   */
  var Prometheus = function ($slider, options) {
    var _this = this;

    this.$slider = $slider;
    this.settings = (options != undefined) ? $.extend({}, this.defaults, options) : this.defaults;
    this.settings.animation = ((options != undefined) && (options.animation != undefined)) ? $.extend({}, this.defaults.animation, options.animation) : this.defaults.animation;
    this.$slides = this.$slider.find(this.settings.slidesSelector);
    this.sliderLocked = false;
    this.timer = undefined;
    this.transitionEndTimer = undefined;
    this.totalImages = (this.$slides.length);
    this.currentPos = 0;

    if (this.$slider.data('initialized')) return;
    this.$slider.data('initialized', true);
    this.$slides.eq(0).addClass(this.settings.activeClass);
    this.$slides.eq(1).addClass('preparator');

    this.turnImagesIntoContainers();
    this.initScriptsFromSettings();

    if (this.settings.autoSlide) {
      this.timer = setTimeout(function () {
        _this.slide(1);
      }, this.settings.startDuration);
    }
  };

  /**
   * It initializes the scripts which are defined in the setting
   */
  Prometheus.prototype.initScriptsFromSettings = function () {
    var _this = this;

    $.each(['beforeSlide', 'beforeTransition', 'afterTransition', 'afterSlide'], function () {
      var __this = this.toString();

      $.subscribe(__this, function () {
        try {
          _this.settings[__this]().call();
        } catch (e) {
          $.each(_this.settings[__this], function (i) {
            _this.settings[__this][i]();
          });
        }
      });
    });
  };

  /**
   * Replaces every <img/> tag to a <div/> with a background image
   */
  Prometheus.prototype.turnImagesIntoContainers = function () {
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

  /**
   * Heart of Prometheus
   * @param {number} direction Represents an index of where we want to go
   * @param {boolean=} forceSlide Forces to slide, even if the slider is locked
   */
  Prometheus.prototype.slide = function (direction, forceSlide) {
    var _this = this,
      currentPos = this.currentPos,
      nextPos = this.getNextIndex(direction);

    $.publish('beforeSlide', nextPos);

    if (!this.sliderLocked || forceSlide) {
      var $currentSlide = this.$slides.eq(currentPos),
        $nextSlide = this.$slides.eq(nextPos);

      if ($nextSlide.data('animation')) this.$slider.find('ul').removeClass().addClass($nextSlide.data('animation'));
      else this.$slider.find('ul').removeClass().addClass(this.settings.animation.type);

      $currentSlide.removeClass('preparator');
      $nextSlide.addClass('preparator');
      $.publish('beforeTransition', nextPos);

      $currentSlide.transition('out', this.settings.animation, this.settings.activeClass, this.images[this.currentPos]);


      if (this.transitionEndTimer) clearTimeout(this.transitionEndTimer);
      this.transitionEndTimer = setTimeout(function () {
        $currentSlide.removeClass(_this.settings.activeClass);
        $currentSlide.find('.tiles').css('background-image', _this.images[currentPos]);
        $currentSlide.find('.tile').remove();
        $nextSlide.addClass(_this.settings.activeClass);
        $nextSlide.removeClass('preparator');
        $.publish('afterTransition', nextPos);
      }, (this.settings.animation.speed + 180));

      this.currentPos = nextPos;
    }

    $.publish('afterSlide', nextPos);

    if (this.settings.autoSlide) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        _this.slide(1);
      }, this.settings.duration);
    }
  };

  /**
   * Counts the next slides number
   * @param {number} to Represents an index of where we want to go
   * @returns {number}
   */
  Prometheus.prototype.getNextIndex = function (to) {
    if ((this.currentPos + to) >= this.totalImages) return 0;
    else if ((this.currentPos + to) < 0) return this.totalImages - 1;
    else return this.currentPos + to;
  };

  /**
   * The default options of Prometheus
   */
  Prometheus.prototype.defaults = {
    activeClass: 'active',
    slidesSelector: "li",
    autoSlide: true,
    startDuration: 5000,
    duration: 3000,
    animation: {
      type: 'fade',
      cols: 7,
      rows: 2,
      random: true,
      speed: 2000
    },
    stopOnHover: false,
    directionNavigation: false,
    directionNavigationPrev: '',
    directionNavigationNext: '',
    controlNavigation: false,
    timerBar: false,
    keyboardNavigation: false,
    keyboardNavigationPrev: 37,
    keyboardNavigationNext: 39,
    mouseScrollNavigation: false,
    touchNavigation: false,
    parallaxEffecting: false,
    beforeSlide: [],
    beforeTransition: [],
    afterTransition: [],
    afterSlide: []
  };

  /**
   * Array of transitions used by random transition
   * @type {Array}
   */
  Prometheus.prototype.transitions = [
    'fade',
    'slide',
    'blocks',
    'blocksZoom',
    'dots',
    'googleNowCards'
  ];

  /**
   * Initializer of Prometheus Slider
   * @param {Object=} options
   * @returns {*|jQuery}
   * @constructor
   */
  $.fn.Prometheus = function (options) {
    return $(this).each(
      function () {
        var modifiers = [
            'stopOnHover',
            'directionNavigation',
            'controlNavigation',
            'timerBar',
            'keyboardNavigation',
            'mouseScrollNavigation',
            'touchNavigation',
            'parallaxEffecting'
          ],
          loadNecessaryPlugins = function () {
            var i = 0;
            while (i < modifiers.length) {
              var modifier = modifiers[i];

              if (modifier.indexOf(p.settings) && (p.settings[modifier] === true)) {
                p[modifier]();
              }
              i++;
            }
          },
          p = new Prometheus($(this), options);

        if (typeof PrometheusDecorators === 'undefined')
          window.PrometheusDecorators = {};

        $.extend(Prometheus.prototype, window.PrometheusDecorators);
        //p.initializeRandomTransitions();
        loadNecessaryPlugins();
      }
    );
  };

})(window, jQuery);
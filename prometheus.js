;(function (window, $, undefined) {
  "use strict";

  $.fn.transition = function () {
    $(this).css3({
      'transition-property': 'all',
      'transition-duration': '.3s',
      'transition-timing-function': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    });
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

    $.publish('preInit');
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

      $currentSlide.transition();

      if (this.transitionEndTimer) clearTimeout(this.transitionEndTimer);
      this.transitionEndTimer = setTimeout(function () {
        $currentSlide.removeClass(_this.settings.activeClass);
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
        loadNecessaryPlugins();
      }
    );
  };

})(window, jQuery);
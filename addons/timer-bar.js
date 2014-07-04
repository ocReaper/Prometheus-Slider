;(function ($) {

  "use strict";

  if (typeof PrometheusDecorators === 'undefined')
    window.PrometheusDecorators = {};

  /**
   * Attaches a timer bar to the slider
   */
  PrometheusDecorators.timerBar = function () {
    var _this = this,
      resetBar = function () {
        return function () {
          if (_this.settings.timerBar) {
            _this.$timerBar.css3({transition: 'none'}).width('0%');
          }
        }
      },
      animateBar = function () {
        return function () {
          if (_this.settings.timerBar) {
            _this.$timerBar.css3({
              'transition-property': 'width',
              'transition-duration': (_this.settings.duration / 1000) + 's',
              'transition-timing-function': 'linear'
            }).width('100%');
          }
        }
      };

    this.$slider.append('<div id="timerBar"></div>');
    this.$timerBar = this.$slider.find('#timerBar');

    $.subscribe('beforeSlide', resetBar());
    $.subscribe('afterSlide', animateBar());
  };

})(jQuery);
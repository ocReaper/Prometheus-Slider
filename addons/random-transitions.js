;(function ($) {

  "use strict";

  if (typeof PrometheusDecorators === 'undefined')
    window.PrometheusDecorators = {};

  /**
   * Creates random transitions
   */
  PrometheusDecorators.initializeRandomTransitions = function () {
    var _this = this;

    _this.randomizeTransition = false;

    if (_this.settings.animation.type === 'random') {
      _this.$slider.find('ul').addClass(_this.transitions[Math.floor(Math.random() * (_this.transitions.length))]);
      _this.randomizeTransition = true;
    }

    $.subscribe('beforeTransition', function () {
      if (_this.randomizeTransition) {
        _this.$slider.find('ul').removeClass().addClass(_this.transitions[Math.floor(Math.random() * (_this.transitions.length))]);
      }
    });
  };

})(jQuery);
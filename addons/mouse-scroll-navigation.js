;(function ($) {

  "use strict";

  if (typeof PrometheusDecorators === 'undefined')
    window.PrometheusDecorators = {};

  /**
   * Listens to mouseWheel event and triggers slide adjusted to the event
   */
  PrometheusDecorators.mouseScrollNavigation = function () {
    var _this = this,
      scrollInterspacer,
      isFirefox = (/Firefox/i.test(navigator.userAgent)),
      mouseWheelEvent = isFirefox ? "DOMMouseScroll" : "mousewheel";

    _this.$slider.unbind(mouseWheelEvent + '.slide').bind(mouseWheelEvent + '.slide', function (e) {
      var eventHandler = isFirefox ? (e.originalEvent.detail > 0) : (e.originalEvent.wheelDelta < 0);

      scrollInterspacer && clearTimeout(scrollInterspacer);
      scrollInterspacer = setTimeout(function () {
        if (eventHandler) {
          _this.slide(1, true);
        } else {
          _this.slide(-1, true);
        }
      }, 250);
    });
  };

})(jQuery);
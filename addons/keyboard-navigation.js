;(function ($) {

  "use strict";

  if (typeof PrometheusDecorators === 'undefined')
    window.PrometheusDecorators = {};

  /**
   * Listens to keydown event and if the pressed key is the controll key it forces a slide
   */
  PrometheusDecorators.keyboardNavigation = function () {
    var _this = this,
      keydownInterspacer;

    $(document).unbind('keydown.slide').bind('keydown.slide', function (e) {
      keydownInterspacer && clearTimeout(keydownInterspacer);
      keydownInterspacer = setTimeout(function () {
        if (e.keyCode === _this.settings.keyboardNavigationNext) _this.slide(1, true);
        if (e.keyCode === _this.settings.keyboardNavigationPrev) _this.slide(-1, true);
      }, 200);
    });
  };

})(jQuery);
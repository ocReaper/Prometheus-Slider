;(function ($) {

  "use strict";

  if (typeof PrometheusDecorators === 'undefined')
    window.PrometheusDecorators = {};

  /**
   * Listens to the clicking event of the directionNavigation buttons
   */
  PrometheusDecorators.directionNavigation = function () {
    var _this = this;

    _this.settings.directionNavigationNext.unbind('click.slide').bind('click.slide', function () {
      _this.slide(1, true);
    });
    _this.settings.directionNavigationPrev.unbind('click.slide').bind('click.slide', function () {
      _this.slide(-1, true);
    });
  };

})(jQuery);
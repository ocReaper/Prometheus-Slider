;(function ($) {

  "use strict";

  if (typeof PrometheusDecorators === 'undefined')
    window.PrometheusDecorators = {};

  /**
   * Initializes a controll navigation
   */
  PrometheusDecorators.controlNavigation = function () {
    var _this = this,
      createPaginationContainer = function () {
        _this.$slider.append('<ul id="pagination"></ul>');
      },
      createBulletsForPagination = function () {
        for (var i = 0; i < _this.totalImages; i++)
          $('#pagination').append('<li><span>&nbsp;</span></li>');
      },
      animatePaginationBullets = function () {
        return function (e, nextPos) {
          var $paginationPage = $('#pagination').find('li');

          $paginationPage.eq(_this.currentPos).removeClass(_this.settings.activeClass);
          $paginationPage.eq(nextPos).addClass(_this.settings.activeClass);
        }
      };

    createPaginationContainer();
    createBulletsForPagination();
    $('#pagination').find('li').eq(0).addClass(_this.settings.activeClass);
    $.subscribe('afterTransition', animatePaginationBullets());
  };

})(jQuery);
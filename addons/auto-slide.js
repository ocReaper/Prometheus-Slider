;(function($){

    "use strict";

    if (typeof PrometheusDecorators === 'undefined')
        window.PrometheusDecorators = {};

    /**
     * Prevents autoSliding on hover
     */
    PrometheusDecorators.stopOnHover = function() {
        var _this = this;

        _this.$slider.unbind('mouseenter.lockSlide').bind('mouseenter.lockSlide', function() {
            _this.sliderLocked = true;
        });
        _this.$slider.unbind('mouseleave.lockSlide').bind('mouseleave.lockSlide', function() {
            _this.sliderLocked = false;
        });
    };

})(jQuery);
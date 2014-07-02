;(function($){

    "use strict";

    if (typeof PrometheusDecorators === 'undefined')
        window.PrometheusDecorators = {};

    /**
     * Adds parallax movements to the slider images
     */
    PrometheusDecorators.parallaxEffecting = function() {
        new ParallaxHandler(this);
    };

    var ParallaxHandler = function(prometheus) {
        var _this = this;

        this.prometheus = prometheus;
        this.isGyroscopic = false;
        this.orientationSupport = !!window.DeviceOrientationEvent;
        this.$parallaxables = undefined;

        this.bindParallaxToCurrentSlide = function() {
            return function() {
                _this.$parallaxables = _this.prometheus.$slides.eq(_this.prometheus.currentPos).find('*').filter(function() {
                    return $(this).data("role") === 'parallaxed'
                });

                if (_this.$parallaxables.length <= 0) return;

                if (_this.orientationSupport && $.browser.mobile) {
                    _this.isGyroscopic = true;

                    $(window).on('deviceorientation',function(e) {
                        var event = e.originalEvent,
                            x = event.beta,
                            y = event.gamma;

                        _this.positionCalculator(x,y);
                        _this.setPosition(_this.$parallaxables);
                    });
                } else {
                    _this.prometheus.$slider.on('mousemove',function(e) {
                        var event = e.originalEvent,
                            x = event.clientX,
                            y = event.clientY;

                        _this.positionCalculator(x,y);
                        _this.setPosition(_this.$parallaxables);
                    });
                }
            }
        };

        this.bindParallaxToCurrentSlide().call();
        $.subscribe('afterSlide',this.bindParallaxToCurrentSlide());

        $.subscribe('beforeSlide',function() {
            if (_this.orientationSupport && $.browser.mobile) {
                $(window).off('deviceorientation');
            } else {
                _this.prometheus.$slider.off('mousemove');
            }
            _this.$parallaxables.css('transform','translate3d(0,0,0)');
        });
    };

    ParallaxHandler.prototype.positionCalculator = function(x,y) {
        var sliderWidth = this.prometheus.$slider.width(),
            sliderHeight = this.prometheus.$slider.height();

        if (this.isGyroscopic) {
            x = Math.abs(x + 10) * -1;
            y = Math.abs(y - 80) * -1;
        } else {
            x = ((x * 100) / sliderWidth) * -1;
            y = ((y * 100) / sliderHeight) * -1;
        }
        x = (x / 6.4) + 10;
        y = (y / 5) + 10;
        this.x = x + '%';
        this.y = y + '%';
    };

    ParallaxHandler.prototype.setPosition = function(element) {
        var _this = this;

        element.each(function(){
            var $this = $(this),
                rotate = (!!$this.attr('transform')) ? $this.attr('transform').replace(/rotate\((.*)\)/,'$1').split(' ')[0] : 0;

            $this.css({
                'transform': 'translate3d(' + _this.x + ',' + _this.y + ',0) rotate(' + rotate + 'deg)'
            });
        });
    };

})(jQuery);
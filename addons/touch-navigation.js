;(function ($) {

  "use strict";

  if (typeof PrometheusDecorators === 'undefined')
    window.PrometheusDecorators = {};

  /**
   * Forces a slide for even the smallest swipe action
   */
  PrometheusDecorators.touchNavigation = function () {
    new TouchHandler(this);
  };

  /**
   * The core of touch handling
   * @param {Prometheus} prometheus
   * @constructor
   */
  var TouchHandler = function (prometheus) {
    var _this = this,
      touchstartInterspacer,
      touchmoveInterspacer;

    this.prometheus = prometheus;
    this.defaultPosition = (this.prometheus.$slider.width() / 2);
    this.currentPosition = this.defaultPosition;
    this.points = [0, 0];

    this.prometheus.$slider.on('touchstart', function (e) {
      touchstartInterspacer && clearTimeout(touchstartInterspacer);
      touchstartInterspacer = setTimeout(function () {
        var event = e.originalEvent;

        _this.start(event);
      }, 200);
    });

    this.prometheus.$slider.on('touchmove', function (e) {
      touchmoveInterspacer && clearTimeout(touchmoveInterspacer);
      touchmoveInterspacer = setTimeout(function () {
        var event = e.originalEvent;

        event.preventDefault();
        _this.move(event);
      }, 200);
    });
  };

  TouchHandler.prototype.start = function (e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      if (e.targetTouches[0].offsetX) {
        this.points[0] = e.targetTouches[0].offsetX;
      } else if (e.targetTouches[0].layerX) {
        this.points[0] = e.targetTouches[0].layerX;
      } else {
        this.points[0] = e.targetTouches[0].pageX;
      }
      this.points[1] = this.points[0];
    }
  };

  TouchHandler.prototype.diff = function () {
    return this.points[1] - this.points[0];
  };

  TouchHandler.prototype.move = function (e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      if (e.targetTouches[0].offsetX) {
        this.points[1] = e.targetTouches[0].offsetX;
      } else if (e.targetTouches[0].layerX) {
        this.points[1] = e.targetTouches[0].layerX;
      } else {
        this.points[1] = e.targetTouches[0].pageX;
      }
      this.swiping(this.diff());
      this.points[0] = this.points[1];
    }
  };

  TouchHandler.prototype.swiping = function (displacement) {
    this.currentPosition += displacement;
    if (this.currentPosition > (this.defaultPosition)) {
      this.prometheus.slide(-1, true);
    } else if (this.currentPosition < this.defaultPosition) {
      this.prometheus.slide(1, true);
    }
    this.currentPosition = this.defaultPosition;
  };

})(jQuery);
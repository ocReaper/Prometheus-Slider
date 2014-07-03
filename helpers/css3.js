;(function ($) {

  "use strict";

  /**
   * Helper function for cross-browser CSS3 support, prepends all possible prefixes to all properties passed in
   * @param {Object} properties Key/value pairs of CSS3 properties
   */
  $.fn.css3 = function (properties) {
    var css = {};
    var prefixes = ['webkit', 'moz', 'ms', 'o'];

    for (var property in properties) {
      for (var i = 0; i < prefixes.length; i++) {
        css['-' + prefixes[i] + '-' + property] = properties[property];
      }
      css[property] = properties[property];
    }

    this.css(css);
    return this;
  };

})(jQuery);
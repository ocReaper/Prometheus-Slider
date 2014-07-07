TestCase("Prometheus", {

  setUp: function () {
    var $slider = $('<div id="slider"><ul><li><img src="assets/slide1.jpg" alt=""/></li><li><img src="assets/slide2.jpg" alt=""/></li></ul><div id="next" class="direction next"></div><div id="prev" class="direction prev"></div></div>');
    this.prometheus = new Prometheus($slider);
  },

  "test prometheus exist": function () {
    assertNotUndefined(this.prometheus);
    assertObject(this.prometheus);
  },

  "test prometheus can count the next slide": function () {
    this.prometheus.currentPos = 1;
    assertEquals(0, this.prometheus.getNextIndex(1));
    assertEquals(0, this.prometheus.getNextIndex(-1));
    this.prometheus.currentPos = 0;
    assertEquals(1, this.prometheus.getNextIndex(1));
    assertEquals(1, this.prometheus.getNextIndex(-1));
  },

  "test prometheus can slide": function () {
    this.prometheus.currentPos = 1;
    assertEquals(1, this.prometheus.currentPos);
    this.prometheus.slide(1);
    assertEquals(0, this.prometheus.currentPos);
    this.prometheus.slide(1);
    assertEquals(1, this.prometheus.currentPos);
  }

});
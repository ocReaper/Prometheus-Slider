TestCase("Prometheus", {

    setUp: function() {
	    $(document).find('body').append('<div id="slider"><ul><li><img src="assets/slide1.jpg" alt=""/></li><li><img src="assets/slide2.jpg" alt=""/></li></ul><div id="next" class="direction next"></div><div id="prev" class="direction prev"></div></div>');
	    this.prometheus = $('#slider').Prometheus();
    },

    "test prometheus exist": function(){
	    assertTrue(true);
    }

});
TestCase("Prometheus", {

    setUp: function() {
	    this.prometheus = new Prometheus();
    },

    "test prometheus exist": function(){
	    assertObject(this.prometheus);
    }

});
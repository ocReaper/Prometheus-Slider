Prometheus = function($slider, options) {
	var _this = this;

	this.$slider = $slider;
	this.settings = (options != undefined) ? $.extend({}, this.defaults, options) : this.defaults;
	this.$slides = this.$slider.find(this.settings.slidesSelector);
	this.sliderLocked = false;
	this.timer = undefined;
    this.totalImages = (this.$slides.length);
    this.currentPos = 0;

	if (this.$slider.data('initialized')) return;
	this.$slider.data('initialized', true);

	this.loadNecessaryPlugins();
	this.timer = setTimeout(function(){ _this.slide(1); }, this.settings.startDuration);
};

//Prometheus.prototype.

Prometheus.prototype.controlNavigation = function() {
	var _this = this;

	_this.$slider.append('<ul id="pagination"></ul>');
	for(var i=0;i<_this.totalImages;i++)
		$('#pagination').append('<li><span>&nbsp;</span></li>');

	Prometheus.prototype.slide = function(direction, forceSlide) {
		var _this = this;

		if (!_this.sliderLocked || forceSlide) {
			var nextPos = _this.getNextIndex(direction),
				$paginationPage = $('#pagination').find('li');

			_this.$slides.eq(_this.currentPos).removeClass(_this.settings.activeClass);
			_this.$slides.eq(nextPos).addClass(_this.settings.activeClass);

			$paginationPage.eq(_this.currentPos).removeClass(_this.settings.activeClass);
			$paginationPage.eq(nextPos).addClass(_this.settings.activeClass);

			_this.currentPos = nextPos;
		}

		if (_this.timer) clearTimeout(_this.timer);
	    _this.timer = setTimeout(function(){ _this.slide(1); }, _this.settings.duration);
	};
};

Prometheus.prototype.directionNavigation = function() {
	var _this = this;
	
	this.settings.directionNavigationNext.unbind('click.slide').bind('click.slide', function() {
		_this.slide(1, true);
	});
	this.settings.directionNavigationPrev.unbind('click.slide').bind('click.slide', function() {
		_this.slide(-1, true);
	});
};

Prometheus.prototype.stopOnHover = function() {
	var _this = this;
	
	this.$slider.unbind('mouseenter.lockSlide').bind('mouseenter.lockSlide', function() {
		_this.sliderLocked = true;
	});
	this.$slider.unbind('mouseleave.lockSlide').bind('mouseleave.lockSlide', function() {
		_this.sliderLocked = false;
	});
};

Prometheus.prototype.loadNecessaryPlugins = function() {
	var i = 0;
	while (i < this.modifiers.length) {
		var modifier = this.modifiers[i];

		if (modifier.indexOf(this.settings) && (this.settings[modifier] === true)) this[modifier]();
		i++;
	}
};

Prometheus.prototype.slide = function(direction, forceSlide) {
	var _this = this;

	if (!this.sliderLocked || forceSlide) {
		var nextPos = this.getNextIndex(direction);

		this.$slides.eq(this.currentPos).removeClass(this.settings.activeClass);
		this.$slides.eq(nextPos).addClass(this.settings.activeClass);

		this.currentPos = nextPos;
	}

	if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(function(){ _this.slide(1); }, this.settings.duration);
};

Prometheus.prototype.getNextIndex = function(to) {
	if ((this.currentPos + to) >= this.totalImages) return 0;
	else if ((this.currentPos + to) < 0) return this.totalImages - 1;
	else return this.currentPos + to;
};

Prometheus.prototype.defaults = {
	activeClass : 'active',
	slidesSelector : "li",
	startDuration : 1000,
	duration : 1000,
	animation : 'fade',
	stopOnHover : false,
	directionNavigation : false,
	directionNavigationPrev : '',
	directionNavigationNext : '',
	controlNavigation : false
};

Prometheus.prototype.modifiers = [
	'stopOnHover',
	'directionNavigation',
	'controlNavigation'
];

$.fn.Prometheus = function(options) {
	return $(this).each(
		function() {
			new Prometheus($(this),options)
		}
	);
};
Prometheus = function($slider, options) {
	var _this = this;

	_this.$slider = $slider;
	_this.settings = (options != undefined) ? $.extend({}, _this.defaults, options) : _this.defaults;
	_this.$slides = _this.$slider.find(_this.settings.slidesSelector);
	_this.sliderLocked = false;
	_this.timer = undefined;
    _this.totalImages = (_this.$slides.length);
    _this.currentPos = 0;

	if (_this.$slider.data('initialized')) return;
	_this.$slider.data('initialized', true);

	_this.loadNecessaryPlugins();
	_this.timer = setTimeout(function(){ _this.slide(1); }, _this.settings.startDuration);
};

//Prometheus.prototype.

//Prometheus.prototype.

Prometheus.prototype.directionNavigation = function() {
	var _this = this;
	
	_this.settings.directionNavigationNext.unbind('click.slide').bind('click.slide', function() {
		_this.slide(1, true);
	});
	_this.settings.directionNavigationPrev.unbind('click.slide').bind('click.slide', function() {
		_this.slide(-1, true);
	});
};

Prometheus.prototype.stopOnHover = function() {
	var _this = this;
	
	_this.$slider.unbind('mouseenter.lockSlide').bind('mouseenter.lockSlide', function() {
		_this.sliderLocked = true;
	});
	_this.$slider.unbind('mouseleave.lockSlide').bind('mouseleave.lockSlide', function() {
		_this.sliderLocked = false;
	});
};

Prometheus.prototype.loadNecessaryPlugins = function() {
	var _this = this,
		i = 0,
		lengthOfModifiers = _this.modifiers.length;

	while (i < lengthOfModifiers) {
		var modifier = _this.modifiers[i];

		if (modifier.indexOf(_this.settings) && (_this.settings[modifier] === true)) _this[modifier]();
		i++;
	}
};

Prometheus.prototype.slide = function(direction, forceSlide) {
	var _this = this;

	if (!_this.sliderLocked || forceSlide) {
		var nextPos = _this.getNextIndex(direction);

		_this.$slides.eq(_this.currentPos).removeClass(_this.settings.activeClass);
		_this.$slides.eq(nextPos).addClass(_this.settings.activeClass);

		_this.currentPos = nextPos;
	}

	if (_this.timer) clearTimeout(_this.timer);
    _this.timer = setTimeout(function(){ _this.slide(1); }, _this.settings.duration);
};

Prometheus.prototype.getNextIndex = function(to) {
	var _this = this;

	if ((_this.currentPos + to) >= _this.totalImages) return 0;
	else if ((_this.currentPos + to) < 0) return _this.totalImages - 1;
	else return _this.currentPos + to;
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
	'directionNavigation'
];

$.fn.Prometheus = function(options) {
	return $(this).each(
		function() {
			new Prometheus($(this),options)
		}
	);
};
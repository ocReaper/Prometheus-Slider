Prometheus = function($slider, options) {
	var settings = (options != undefined) ? $.extend({}, this.defaults, options) : this.defaults,
		$slides = $slider.find(settings.slidesSelector),
		timer,
	    totalImages = ($slides.length),
	    currentPos = 0,
		sliderLocked = false,

		getNextIndex = function(to) {
			if ((currentPos + to) >= totalImages) return 0;
			else if ((currentPos + to) < 0) return totalImages - 1;
			else return currentPos + to;
		},

		slide = function(direction, forceSlide) {
			if (!sliderLocked || forceSlide) {
				var nextPos = getNextIndex(direction);

				$slides.eq(currentPos).removeClass(settings.activeClass);
				$slides.eq(nextPos).addClass(settings.activeClass);

				currentPos = nextPos;
			}

			if (timer) clearTimeout(timer);
	        timer = setTimeout(function(){ slide(1); }, settings.duration);
		};

	if ($slider.data('initialized')) return;
	$slider.data('initialized', true);

	if (settings.directionNavigation) {
		settings.directionNavigationNext.unbind('click.slide').bind('click.slide', function(){ slide(1, true); });
	    settings.directionNavigationPrev.unbind('click.slide').bind('click.slide', function(){ slide(-1, true); });
	}

	if (settings.stopOnHover) {
	    $slider.unbind('mouseenter.lockSlide').bind('mouseenter.lockSlide', function(){ sliderLocked = true; });
	    $slider.unbind('mouseleave.lockSlide').bind('mouseleave.lockSlide', function(){ sliderLocked = false; });
	}

	var i = 0,
		lengthOfModifiers = this.modifiers.length;
	while (i < lengthOfModifiers) {
		var modifier = this.modifiers[i];

		if (modifier.indexOf(settings) && (settings[modifier] === true)) console.log(modifier);
		i++;
	}

    this.timer = setTimeout(function(){ slide(1); }, settings.startDuration);
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
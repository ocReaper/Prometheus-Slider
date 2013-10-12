/**
 * Helper function for cross-browser CSS3 support, prepends all possible prefixes to all properties passed in
 * @param {Object} properties Key/value pairs of CSS3 properties
 */
$.fn.css3 = function(properties) {
	var css = {};
	var prefixes = ['webkit', 'moz', 'ms', 'o'];

	for(var property in properties)
	{
		for(var i=0; i<prefixes.length; i++) {
			css['-' + prefixes[i] + '-' + property] = properties[property];
		}
		css[property] = properties[property];
	}

	this.css(css);
	return this;
};

TouchHandler = function(element, callbacks) {
	var _this = this,
		touchstartInterspacer,
		touchmoveInterspacer;
	this.el = element;
	this.cbs = callbacks;
	this.points = [0, 0];
        
	this.el.addEventListener('touchstart', function(e) {
		touchstartInterspacer && clearTimeout(touchstartInterspacer);
	    touchstartInterspacer = setTimeout(function() {
			_this.start(e);
        }, 200);
	});
	
	this.el.addEventListener('touchmove', function(e) {
		touchmoveInterspacer && clearTimeout(touchmoveInterspacer);
        touchmoveInterspacer = setTimeout(function() {
			e.preventDefault();
			_this.move(e);
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

TouchHandler.prototype.diff = function() {
	return this.points[1] - this.points[0];
};

TouchHandler.prototype.move = function(e) {
	if (e.targetTouches && e.targetTouches.length === 1) {
		if (e.targetTouches[0].offsetX) {
			this.points[1] = e.targetTouches[0].offsetX;
		} else if (e.targetTouches[0].layerX) {
			this.points[1] = e.targetTouches[0].layerX;
		} else {
			this.points[1] = e.targetTouches[0].pageX;
		}
		this.cbs.swiping(this.diff());
		this.points[0] = this.points[1];
	}
};

$.fn.touchHandler = function(callbacks) {
	if (typeof callbacks.swiping !== 'function') {
		throw '"swiping" callback must be defined.';
	}

	return this.each(function() {
		var _this = $(this),
			touchHandler = _this.data('touchHandler');

		if (!touchHandler) {
			_this.data('touchHandler', (touchHandler = new TouchHandler(this, callbacks)));
		}
	});
};

/**
 * This function provides the tile creation and the transition handling as the name says
 * @param {string} way The way of the transition (= in/out)
 * @param {Object} settings The animation perferences given by this.settings.animation
 * @param {string} activeClass The activeClass from this.settings
 * @param {string} image The url of the image get by jQuery like "url(http://domain.com/assets/slide1.jpg)"
 */
$.fn.transition = function(way,settings,activeClass,image) {

	var $container = $(this),
		width = $container.width(),
		height = $container.height(),
		$img = $container.find('.tiles'),
		initialized = !!($img.find('.tile').length > 0),
		imageBackground = (initialized ? image : $img.css('background-image')),
		n_tiles = settings.cols * settings.rows,
		tiles = [],
		$tiles,
		range = function ( min, max, rand ) {
			var arr = ( new Array( ++max - min ) )
				.join('.').split('.')
				.map(function( v,i ){ return min + i });
			return rand
				? arr.map(function( v ) { return [ Math.random(), v ] })
					.sort().map(function( v ) { return v[ 1 ] })
				: arr;
		},
		createTilesByImage = function() {
			for (var i = 0; i < n_tiles; i++) {
				tiles.push('<div class="tile"></div>');
			}
			$tiles = $(tiles.join(''));
			$img.append($tiles);
			$tiles.css({
				width: width / settings.cols,
				height: height / settings.rows,
				backgroundImage: imageBackground
			}).css3({
				transition : 'none'
			});
			$tiles.each(function() {
				var pos = $(this).position();
				$(this).css('backgroundPosition', -pos.left + 'px ' + -pos.top + 'px').css3({
					'transition-property' : 'all',
					'transition-duration' : '.3s',
					'transition-timing-function' : 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
				});
			});
		},
		doAnimationWithTheCreatedTiles = function() {
			var tilesArr = range(0, n_tiles, settings.random),
				tileSpeed = settings.speed / n_tiles,
				animateTilesWithDelay = function() {
					tilesArr.forEach(function(tile, i) {
						$tiles.eq(tile).css3({'transition-delay':((i*tileSpeed)/1000)+'s'});
					});
				};

			switch (way) {
				case 'out':
					$tiles.css3({transition:'none'});
					$container.removeClass(activeClass);
					$img.css('background-image',imageBackground);
				break;
				case 'in':
					$img.css('background-image','');
					$tiles.css3({
						'transition-property' : 'all',
						'transition-duration' : '.3s',
						'transition-timing-function' : 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
					});
					animateTilesWithDelay();
					$container.addClass(activeClass);
					break;
			}
		},
		checkInitialization = function() {
			if (initialized) {
				$tiles = $img.find('.tile');
			} else createTilesByImage();
		};

	checkInitialization();
	doAnimationWithTheCreatedTiles();
};

Prometheus = function($slider, options) {
	var _this = this;

	this.$slider = $slider;
	this.settings = (options != undefined) ? $.extend({}, this.defaults, options) : this.defaults;
	this.settings.animation = ((options != undefined) && (options.animation != undefined)) ? $.extend({}, this.defaults.animation, options.animation) : this.defaults.animation;
	this.$slides = this.$slider.find(this.settings.slidesSelector);
	this.sliderLocked = false;
	this.timer = undefined;
    this.totalImages = (this.$slides.length);
    this.currentPos = 0;
	this.randomizeTransition = false;

	if (this.$slider.data('initialized')) return;
	this.$slider.data('initialized', true);

	this.initializeRandomTransitions();

	this.loadNecessaryPlugins();
	this.turnImagesIntoContainers();
	this.timer = setTimeout(function(){ _this.slide(1); }, this.settings.startDuration);
};

Prometheus.prototype.touchNavigation = function() {
	var _this = this,
		defposition = (this.$slider.width() / 2),
		currPos = defposition,
		cb = {
			swiping: function(displacement) {
				currPos += displacement;
				if (currPos > (defposition)) {
					_this.slide(-1,true);
				} else if (currPos < defposition) {
					_this.slide(1,true);
				}
				currPos = defposition;
			}
		};

	this.$slider.touchHandler(cb);
};

Prometheus.prototype.mouseScrollNavigation = function() {
	var _this = this,
		scrollInterspacer,
		isFirefox = (/Firefox/i.test(navigator.userAgent)),
		mouseWheelEvent = isFirefox ? "DOMMouseScroll" : "mousewheel";

	this.$slider.unbind(mouseWheelEvent + '.slide').bind(mouseWheelEvent + '.slide', function(e) {
		var eventHandler = isFirefox ? (e.originalEvent.detail > 0) : (e.originalEvent.wheelDelta < 0);

		scrollInterspacer && clearTimeout(scrollInterspacer);
        scrollInterspacer = setTimeout(function() {
			if (eventHandler){
				_this.slide(1, true);
			} else {
				_this.slide(-1, true);
			}
        }, 250);
	});
};

Prometheus.prototype.keyboardNavigation = function() {
	var _this = this,
		keydownInterspacer;

	$(document).unbind('keydown.slide').bind('keydown.slide', function(e) {
		keydownInterspacer && clearTimeout(keydownInterspacer);
        keydownInterspacer = setTimeout(function() {
			if(e.keyCode === _this.settings.keyboardNavigationNext) _this.slide(1, true);
			if(e.keyCode === _this.settings.keyboardNavigationPrev) _this.slide(-1, true);
        }, 200);
	});
};

Prometheus.prototype.timerBar = function() {
	this.$slider.append('<div id="timerBar"></div>');
	this.$timerBar = this.$slider.find('#timerBar');
};

Prometheus.prototype.initializeRandomTransitions = function() {
	if (this.settings.animation.type === 'random') {
		this.$slider.find('ul').addClass(this.transitions[Math.floor(Math.random() * (this.transitions.length))]);
		this.randomizeTransition = true;
	}
};

Prometheus.prototype.turnImagesIntoContainers = function() {
	var _this = this;

	this.images = [];

	this.$slides.each(function() {
		var $this = $(this),
			$img = $this.find('img'),
			$tiles = $('<div class="tiles"></div>');

		$img.hide();
		$this.append($tiles);
		$tiles.css('background-image', 'url(' + $img.attr('src') + ')');
		_this.images.push($tiles.css('background-image'));
		$img.remove();
	});
};

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

	if(this.settings.timerBar) {
		this.$timerBar.css3({transition:'none'}).width('0%');
	}
	if (!this.sliderLocked || forceSlide) {
		var nextPos = this.getNextIndex(direction),
			$currentSlide = this.$slides.eq(this.currentPos),
			$nextSlide = this.$slides.eq(nextPos);

		if(this.randomizeTransition) {
			this.$slider.find('ul').removeClass().addClass(this.transitions[Math.floor(Math.random() * (this.transitions.length))]);
		}
		$currentSlide.transition('out',this.settings.animation,this.settings.activeClass,this.images[this.currentPos]);
		$nextSlide.transition('in',this.settings.animation,this.settings.activeClass);

		if(this.settings.timerBar) {
			this.$timerBar.css3({
				'transition-property' : 'width',
				'transition-duration' : (this.settings.duration / 1000) + 's',
				'transition-timing-function' : 'linear'
			}).width('100%');
		}

		this.currentPos = nextPos;
	}

	if (this.settings.autoSlide) {
		if (this.timer) clearTimeout(this.timer);
	    this.timer = setTimeout(function(){ _this.slide(1); }, this.settings.duration);
	}
};

Prometheus.prototype.getNextIndex = function(to) {
	if ((this.currentPos + to) >= this.totalImages) return 0;
	else if ((this.currentPos + to) < 0) return this.totalImages - 1;
	else return this.currentPos + to;
};

Prometheus.prototype.defaults = {
	activeClass : 'active',
	slidesSelector : "li",
	autoSlide : true,
	startDuration : 0,
	duration : 3000,
	animation : {
		type : 'fade',
	    cols : 7,
	    rows : 2,
	    random : true,
		speed : 2000
	},
	stopOnHover : false,
	directionNavigation : false,
	directionNavigationPrev : '',
	directionNavigationNext : '',
	controlNavigation : false,
	timerBar : false,
	keyboardNavigation : false,
	keyboardNavigationPrev : 37,
	keyboardNavigationNext : 39,
	mouseScrollNavigation : false,
	touchNavigation : false
};

Prometheus.prototype.modifiers = [
	'stopOnHover',
	'directionNavigation',
	'controlNavigation',
	'timerBar',
	'keyboardNavigation',
	'mouseScrollNavigation',
	'touchNavigation'
];

Prometheus.prototype.transitions = [
	'fade',
	'slide',
	'blocks',
	'blocksZoom',
	'dots'
];

$.fn.Prometheus = function(options) {
	return $(this).each(
		function() {
			new Prometheus($(this),options)
		}
	);
};
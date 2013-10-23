/*!
 * Tiny Pub/Sub - v0.7.0 - 2013-01-29
 * https://github.com/cowboy/jquery-tiny-pubsub
 * Copyright (c) 2013 "Cowboy" Ben Alman; Licensed MIT
 */
(function($) {

	var o = $({});

	$.subscribe = function() {
		o.on.apply(o, arguments);
	};

	$.unsubscribe = function() {
		o.off.apply(o, arguments);
	};

	$.publish = function() {
		o.trigger.apply(o, arguments);
	};

}(jQuery));

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
						'transition-timing-function' : 'cubic-bezier(0.390, 0.575, 0.565, 1.000)'
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

/**
 * Creator of magic, constructor of Prometheus
 * @param {Object} $slider Requires a jQuery node
 * @param {Object=} options An optional object of options to override the defaults
 * @constructor
 */
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
	this.turnImagesIntoContainers();
	this.initScriptsFromSettings();

	this.timer = setTimeout(function(){ _this.slide(1); }, this.settings.startDuration);
};

/**
 * It initializes the scripts which are defined in the setting
 */
Prometheus.prototype.initScriptsFromSettings = function() {
	var _this = this;

	$.subscribe("beforeSlide", function() {
		try {
			_this.settings.beforeSlide().call();
		} catch (e) {
			$.each(_this.settings.beforeSlide, function(i) {
				_this.settings.beforeSlide[i]();
			});
		}
	});
	$.subscribe("beforeTransition", function() {
		try {
			_this.settings.beforeTransition().call();
		} catch (e) {
			$.each(_this.settings.beforeTransition, function(i) {
				_this.settings.beforeTransition[i]();
			});
		}
	});
	$.subscribe("afterTransition", function() {
		try {
			_this.settings.afterTransition().call();
		} catch (e) {
			$.each(_this.settings.afterTransition, function(i) {
				_this.settings.afterTransition[i]();
			});
		}
	});
	$.subscribe("afterSlide", function() {
		try {
			_this.settings.afterSlide().call();
		} catch (e) {
			$.each(_this.settings.afterSlide, function(i) {
				_this.settings.afterSlide[i]();
			});
		}
	});
};

/**
 * Creates random transitions
 */
Prometheus.prototype.initializeRandomTransitions = function() {
	var _this = this;
	
	if (this.settings.animation.type === 'random') {
		this.$slider.find('ul').addClass(this.transitions[Math.floor(Math.random() * (this.transitions.length))]);
		this.randomizeTransition = true;
	}

	$.subscribe('beforeTransition', function() {
		if(_this.randomizeTransition) {
			_this.$slider.find('ul').removeClass().addClass(_this.transitions[Math.floor(Math.random() * (_this.transitions.length))]);
		}
	});
};

/**
 * Replaces every <img/> tag to a <div/> with a background image
 */
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

/**
 * Heart of Prometheus
 * @param {number} direction Represents an index of where we want to go
 * @param {boolean=} forceSlide Forces to slide, even if the slider is locked
 */
Prometheus.prototype.slide = function(direction, forceSlide) {
	var _this = this,
		nextPos = this.getNextIndex(direction);

	$.publish('beforeSlide', nextPos);

	if (!this.sliderLocked || forceSlide) {
		var $currentSlide = this.$slides.eq(this.currentPos),
			$nextSlide = this.$slides.eq(nextPos);

		$.publish('beforeTransition', nextPos);

		$currentSlide.transition('out',this.settings.animation,this.settings.activeClass,this.images[this.currentPos]);
		$nextSlide.transition('in',this.settings.animation,this.settings.activeClass);

		$.publish('afterTransition', nextPos);

		this.currentPos = nextPos;
	}

	$.publish('afterSlide', nextPos);

	if (this.settings.autoSlide) {
		if (this.timer) clearTimeout(this.timer);
	    this.timer = setTimeout(function(){ _this.slide(1); }, this.settings.duration);
	}
};

/**
 * Counts the next slides number
 * @param {number} to Represents an index of where we want to go
 * @returns {number}
 */
Prometheus.prototype.getNextIndex = function(to) {
	if ((this.currentPos + to) >= this.totalImages) return 0;
	else if ((this.currentPos + to) < 0) return this.totalImages - 1;
	else return this.currentPos + to;
};

/**
 * The default options of Prometheus
 * @type {{activeClass: string, slidesSelector: string, autoSlide: boolean, startDuration: number, duration: number, animation: {type: string, cols: number, rows: number, random: boolean, speed: number}, stopOnHover: boolean, directionNavigation: boolean, directionNavigationPrev: string, directionNavigationNext: string, controlNavigation: boolean, timerBar: boolean, keyboardNavigation: boolean, keyboardNavigationPrev: number, keyboardNavigationNext: number, mouseScrollNavigation: boolean, touchNavigation: boolean, init: Array, beforeSlide: Array, beforeTransition: Array, afterSlide: Array, afterTransition: Array}}
 */
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
	touchNavigation : false,
	beforeSlide : [],
	beforeTransition : [],
	afterTransition : [],
	afterSlide : []
};

/**
 * Array of transitions used by random transition
 * @type {Array}
 */
Prometheus.prototype.transitions = [
	'fade',
	'slide',
	'blocks',
	'blocksZoom',
	'dots',
	'googleNowCards'
];

$.fn.Prometheus = function(options) {
	return $(this).each(
		function() {
			var loadNecessaryPlugins = function() {
				var i = 0;
				while (i < modifiers.length) {
					var modifier = modifiers[i];

					if (modifier.indexOf(p.settings) && (p.settings[modifier] === true)) window[modifier](p);
					i++;
				}
			},
			modifiers = [
				'stopOnHover',
				'directionNavigation',
				'controlNavigation',
				'timerBar',
				'keyboardNavigation',
				'mouseScrollNavigation',
				'touchNavigation'
			],
			p = new Prometheus($(this),options);

			loadNecessaryPlugins();
		}
	);
};

/**
 * Forces a slide for even the smallest swipe action
 */
touchNavigation = function(Prometheus) {
	var _this = Prometheus,
		defaultPosition = (Prometheus.$slider.width() / 2),
		currentPosition = defaultPosition,
		cb = {
			swiping: function(displacement) {
				currentPosition += displacement;
				if (currentPosition > (defaultPosition)) {
					_this.slide(-1,true);
				} else if (currentPosition < defaultPosition) {
					_this.slide(1,true);
				}
				currentPosition = defaultPosition;
			}
		};

	Prometheus.$slider.touchHandler(cb);
};

/**
 * Listens to mouseWheel event and triggers slide adjusted to the event
 */
mouseScrollNavigation = function(Prometheus) {
	var _this = Prometheus,
		scrollInterspacer,
		isFirefox = (/Firefox/i.test(navigator.userAgent)),
		mouseWheelEvent = isFirefox ? "DOMMouseScroll" : "mousewheel";

	Prometheus.$slider.unbind(mouseWheelEvent + '.slide').bind(mouseWheelEvent + '.slide', function(e) {
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

/**
 * Listens to keydown event and if the pressed key is the controll key it forces a slide
 */
keyboardNavigation = function(Prometheus) {
	var _this = Prometheus,
		keydownInterspacer;

	$(document).unbind('keydown.slide').bind('keydown.slide', function(e) {
		keydownInterspacer && clearTimeout(keydownInterspacer);
        keydownInterspacer = setTimeout(function() {
			if(e.keyCode === _this.settings.keyboardNavigationNext) _this.slide(1, true);
			if(e.keyCode === _this.settings.keyboardNavigationPrev) _this.slide(-1, true);
        }, 200);
	});
};

/**
 * Attaches a timer bar to the slider
 */
timerBar = function(Prometheus) {
	var _this = Prometheus,
		resetBar = function() {
			return function() {
				if(_this.settings.timerBar) {
					_this.$timerBar.css3({transition:'none'}).width('0%');
				}
			}
		},
		animateBar = function() {
			return function() {
				if(_this.settings.timerBar) {
					_this.$timerBar.css3({
						'transition-property' : 'width',
						'transition-duration' : (_this.settings.duration / 1000) + 's',
						'transition-timing-function' : 'linear'
					}).width('100%');
				}
			}
		};

	Prometheus.$slider.append('<div id="timerBar"></div>');
	Prometheus.$timerBar = Prometheus.$slider.find('#timerBar');

	$.subscribe('beforeSlide', resetBar());
	$.subscribe('afterSlide', animateBar());
};

/**
 * Initializes a controll navigation
 */
controlNavigation = function(Prometheus) {
	var _this = Prometheus,
		createPaginationContainer = function() {
			_this.$slider.append('<ul id="pagination"></ul>');
		},
		createBulletsForPagination = function() {
			for (var i = 0; i < _this.totalImages; i++)
				$('#pagination').append('<li><span>&nbsp;</span></li>');
		},
		animatePaginationBullets = function() {
			return function(e,nextPos) {
				var $paginationPage = $('#pagination').find('li');

				$paginationPage.eq(_this.currentPos).removeClass(_this.settings.activeClass);
				$paginationPage.eq(nextPos).addClass(_this.settings.activeClass);
			}
		};

	createPaginationContainer();
	createBulletsForPagination();
	$.subscribe('afterTransition', animatePaginationBullets());
};

/**
 * Listens to the clicking event of the directionNavigation buttons
 */
directionNavigation = function(Prometheus) {
	var _this = Prometheus;

	Prometheus.settings.directionNavigationNext.unbind('click.slide').bind('click.slide', function() {
		_this.slide(1, true);
	});
	Prometheus.settings.directionNavigationPrev.unbind('click.slide').bind('click.slide', function() {
		_this.slide(-1, true);
	});
};

/**
 * Prevents autoSliding on hover
 */
stopOnHover = function(Prometheus) {
	var _this = Prometheus;

	Prometheus.$slider.unbind('mouseenter.lockSlide').bind('mouseenter.lockSlide', function() {
		_this.sliderLocked = true;
	});
	Prometheus.$slider.unbind('mouseleave.lockSlide').bind('mouseleave.lockSlide', function() {
		_this.sliderLocked = false;
	});
};
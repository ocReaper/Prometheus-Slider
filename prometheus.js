;(function(window,$,undefined){
	"use strict";

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
	 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
	 *
	 * jQuery.browser.mobile will be true if the browser is a mobile device
	 *
	 **/
	(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

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

	/**
	 * The core of touch handling
	 * @param {Prometheus} prometheus
	 * @constructor
	 */
	var TouchHandler = function(prometheus) {
		var _this = this,
			touchstartInterspacer,
			touchmoveInterspacer;

		this.prometheus = prometheus;
		this.defaultPosition = (this.prometheus.$slider.width() / 2);
		this.currentPosition = this.defaultPosition;
		this.points = [0, 0];

		this.prometheus.$slider.on('touchstart', function(e) {
			touchstartInterspacer && clearTimeout(touchstartInterspacer);
		    touchstartInterspacer = setTimeout(function() {
				var event = e.originalEvent;

			    _this.start(event);
	        }, 200);
		});

		this.prometheus.$slider.on('touchmove', function(e) {
			touchmoveInterspacer && clearTimeout(touchmoveInterspacer);
	        touchmoveInterspacer = setTimeout(function() {
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
			this.swiping(this.diff());
			this.points[0] = this.points[1];
		}
	};

	TouchHandler.prototype.swiping = function(displacement) {
		this.currentPosition += displacement;
		if (this.currentPosition > (this.defaultPosition)) {
			this.prometheus.slide(-1,true);
		} else if (this.currentPosition < this.defaultPosition) {
			this.prometheus.slide(1,true);
		}
		this.currentPosition = this.defaultPosition;
	};

	var ParallaxHandler = function(prometheus) {
		var _this = this;
		
		this.prometheus = prometheus;
		this.isGyroscopic = false;
		this.orientationSupport = !!window.DeviceOrientationEvent;

		this.prometheus.$slides.each(function(){
			$(this).css({'left':'10%','top':'10%','transform':'translate3d(-10%,-10%,0)'})
		});

		if (this.orientationSupport && $.browser.mobile) {
			this.isGyroscopic = true;

			$(window).on('orientationchange',function(e) {
				var event = e.originalEvent,
					x = event.beta,
					y = event.gamma;

				_this.positionCalculator(x,y);
				_this.setPosition(_this.prometheus.$slides.eq(_this.prometheus.currentPos));
			});
		} else {
			this.prometheus.$slider.on('mousemove',function(e) {
				var event = e.originalEvent,
					x = event.clientX,
					y = event.clientY;

				_this.positionCalculator(x,y);
				_this.setPosition(_this.prometheus.$slides.eq(_this.prometheus.currentPos));
			});
		}
	};

	ParallaxHandler.prototype.positionCalculator = function(x,y) {
		var sliderWidth = this.prometheus.$slider.width(),
			sliderHeight = this.prometheus.$slider.height();

		if (this.isGyroscopic) {
			x = Math.abs(x + 10) * -1;
			y = Math.abs(y - 80) * -1;
			x = (x / 6.5);
			y = (y / 6.5);
			this.x = x + '%';
			this.y = y + '%';
		} else {
			x = ((x * 100) / sliderWidth) * -1;
			y = ((y * 100) / sliderHeight) * -1;
			x = (x / 6.5);
			y = (y / 6.5);
			this.x = x + '%';
			this.y = y + '%';
		}
	};

	ParallaxHandler.prototype.setPosition = function(element) {
		element.css('transform', 'translate3d(' + this.x + ',' + this.y + ',0)');
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
			initialized = ($img.find('.tile').length > 0),
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
	var Prometheus = function($slider, options) {
		var _this = this;

		this.$slider = $slider;
		this.settings = (options != undefined) ? $.extend({}, this.defaults, options) : this.defaults;
		this.settings.animation = ((options != undefined) && (options.animation != undefined)) ? $.extend({}, this.defaults.animation, options.animation) : this.defaults.animation;
		this.$slides = this.$slider.find(this.settings.slidesSelector);
		this.sliderLocked = false;
		this.timer = undefined;
	    this.totalImages = (this.$slides.length);
	    this.currentPos = 0;

		if (this.$slider.data('initialized')) return;
		this.$slider.data('initialized', true);

		this.turnImagesIntoContainers();
		this.initScriptsFromSettings();

		this.timer = setTimeout(function(){ _this.slide(1); }, this.settings.startDuration);
	};

	/**
	 * It initializes the scripts which are defined in the setting
	 */
	Prometheus.prototype.initScriptsFromSettings = function() {
		var _this = this;

		$.each(['beforeSlide','beforeTransition','afterTransition','afterSlide'],function() {
			var __this = this.toString();

			$.subscribe(__this, function() {
				try {
					_this.settings[__this]().call();
				} catch (e) {
					$.each(_this.settings[__this], function(i) {
						_this.settings[__this][i]();
					});
				}
			});
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
		parallaxEffecting : false,
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

	/**
	 * Initializer of Prometheus Slider
	 * @param {Object=} options
	 * @returns {*|jQuery}
	 * @constructor
	 */
	$.fn.Prometheus = function(options) {
		return $(this).each(
			function() {
				var modifiers = [
						'stopOnHover',
						'directionNavigation',
						'controlNavigation',
						'timerBar',
						'keyboardNavigation',
						'mouseScrollNavigation',
						'touchNavigation',
						'parallaxEffecting'
					],
					loadNecessaryPlugins = function() {
						var i = 0;
						while (i < modifiers.length) {
							var modifier = modifiers[i];

							if (modifier.indexOf(p.settings) && (p.settings[modifier] === true)) {
								p[modifier]();
							}
							i++;
						}
					},
					p = new Prometheus($(this),options);

				$.extend( Prometheus.prototype, PrometheusDecorators );
				p.initializeRandomTransitions();
				loadNecessaryPlugins();
			}
		);
	};

	var PrometheusDecorators = {};

	/**
	 * Adds parallax movements to the slider images
	 */
	PrometheusDecorators.parallaxEffecting = function() {
		new ParallaxHandler(this);
	};

	/**
	 * Creates random transitions
	 */
	PrometheusDecorators.initializeRandomTransitions = function() {
		var _this = this;

		_this.randomizeTransition = false;

		if (_this.settings.animation.type === 'random') {
			_this.$slider.find('ul').addClass(_this.transitions[Math.floor(Math.random() * (_this.transitions.length))]);
			_this.randomizeTransition = true;
		}

		$.subscribe('beforeTransition', function() {
			if(_this.randomizeTransition) {
				_this.$slider.find('ul').removeClass().addClass(_this.transitions[Math.floor(Math.random() * (_this.transitions.length))]);
			}
		});
	};

	/**
	 * Forces a slide for even the smallest swipe action
	 */
	PrometheusDecorators.touchNavigation = function() {
		new TouchHandler(this);
	};

	/**
	 * Listens to mouseWheel event and triggers slide adjusted to the event
	 */
	PrometheusDecorators.mouseScrollNavigation = function() {
		var _this = this,
			scrollInterspacer,
			isFirefox = (/Firefox/i.test(navigator.userAgent)),
			mouseWheelEvent = isFirefox ? "DOMMouseScroll" : "mousewheel";

		_this.$slider.unbind(mouseWheelEvent + '.slide').bind(mouseWheelEvent + '.slide', function(e) {
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
	PrometheusDecorators.keyboardNavigation = function() {
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

	/**
	 * Attaches a timer bar to the slider
	 */
	PrometheusDecorators.timerBar = function() {
		var _this = this,
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

		_this.$slider.append('<div id="timerBar"></div>');
		_this.$timerBar = _this.$slider.find('#timerBar');

		$.subscribe('beforeSlide', resetBar());
		$.subscribe('afterSlide', animateBar());
	};

	/**
	 * Initializes a controll navigation
	 */
	PrometheusDecorators.controlNavigation = function() {
		var _this = this,
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
	PrometheusDecorators.directionNavigation = function() {
		var _this = this;

		_this.settings.directionNavigationNext.unbind('click.slide').bind('click.slide', function() {
			_this.slide(1, true);
		});
		_this.settings.directionNavigationPrev.unbind('click.slide').bind('click.slide', function() {
			_this.slide(-1, true);
		});
	};

	/**
	 * Prevents autoSliding on hover
	 */
	PrometheusDecorators.stopOnHover = function() {
		var _this = this;

		_this.$slider.unbind('mouseenter.lockSlide').bind('mouseenter.lockSlide', function() {
			_this.sliderLocked = true;
		});
		_this.$slider.unbind('mouseleave.lockSlide').bind('mouseleave.lockSlide', function() {
			_this.sliderLocked = false;
		});
	};
})(window,jQuery);
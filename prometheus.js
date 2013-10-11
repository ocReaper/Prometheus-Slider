/**
 * Helper function for cross-browser CSS3 support, prepends all possible prefixes to all properties passed in
 * @param {Object} props Key/value pairs of CSS3 properties
 */
$.fn.css3 = function(props) {
	var css = {};
	var prefixes = ['webkit', 'moz', 'ms', 'o'];

	for(var prop in props)
	{
		for(var i=0; i<prefixes.length; i++) {
			css['-' + prefixes[i] + '-' + prop] = props[prop];
		}
		css[prop] = props[prop];
	}

	this.css(css);
	return this;
};

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
		};

	if (initialized) {
		$tiles = $img.find('.tile');
	} else createTilesByImage();
	doAnimationWithTheCreatedTiles();
};

Prometheus = function($slider, options) {
	var _this = this;

	this.$slider = $slider;
	this.settings = (options != undefined) ? $.extend({}, this.defaults, options) : this.defaults;
	this.$slides = this.$slider.find(this.settings.slidesSelector);
	this.sliderLocked = false;
	this.timer = undefined;
    this.totalImages = (this.$slides.length);
    this.currentPos = 0;
	this.images = [];

	if (this.$slider.data('initialized')) return;
	this.$slider.data('initialized', true);
	this.$slider.find('ul').addClass(this.settings.animation.type);

	this.loadNecessaryPlugins();
	this.$slides.each(function(){
		var $this = $(this),
			$img = $this.find('img'),
			$tiles = $('<div class="tiles"></div>');

		$img.hide();
		$this.append($tiles);
		$tiles.css('background-image','url(' + $img.attr('src') + ')');
		_this.images.push($tiles.css('background-image'));
		$img.remove();
	});
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
		var nextPos = this.getNextIndex(direction),
			$currentSlide = this.$slides.eq(this.currentPos),
			$nextSlide = this.$slides.eq(nextPos);

		$currentSlide.transition('out',this.settings.animation,this.settings.activeClass,this.images[this.currentPos]);
		console.log(this.images[this.currentPos]);
		$nextSlide.transition('in',this.settings.animation,this.settings.activeClass);

//		$currentSlide.removeClass(this.settings.activeClass);
//		$nextSlide.addClass(this.settings.activeClass);

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
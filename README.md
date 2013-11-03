# Prometheus Slider
A fully customizable jQuery Slider plugin with CSS3 based image transitions

## Features of the slider

- Fully customizable by settings
- Optimized for touch devices
- API for sliding events
- Your image can be cut up to infinite pices
- 5 different transitions
- You can add your own by defining in CSS
- Written in LESS
- Almost fully annotated, so you will be happy if you use IDE
- Autoslide
- Stop on hover
- Direction navigation
- Keyboard navigation
- Mousewheel navigation
- Touch navigation
- Bullet indicator
- Timer bar

## Properties

### activeClass *{string}*
Defines what classname will be added to the active slide.
The default is `active`.

### slidesSelector *{string}*
Defines the html wrapper of the slides.
The default is `li`.

### autoSlide *{boolean}*
Defines whether the slider will automatically slide to the next slide or not.
The default is `true`.

### startDuration *{number}*
Defines the delay of the first slide event in miliseconds.
The default is `0`.
*Note: Requires autoSlide to be true*

### duration *{number}*
Defines the delay between the slide events in miliseconds.
The default is `3000`. *So 3 seconds*
*Note: Requires autoSlide to be true*

### animation *{Object}*

#### animation:type *{string}*
Defines the animaton of the next slide. This is a classname which will be added to the slider itself.
It is defined in the CSS, so you can create your own animation in CSS!
All you need to do is just define a good (class)name for it and simply call here.
Also you can define it as `random`. The result will be a different animation for each slide event!
The default is `fade`.

#### animation:cols *{number}*
It will slice your image vertically to the given number! *Can be 1*
The default is `7`.

#### animation:rows *{number}*
It will slice your image horizontally to the given number! *Can be 1*
The default is `2`.

#### animation:random *{boolean}*
If it's `true` then the animation of blocks will be delayed with random seconds
The default is `true`.

#### animation:speed *{number}*
Defines the speed of the full animation NOT the animation speed of the blocks!
The default is `2000`.

### stopOnHover *{boolean}*
Defines whether the slider will stop on hover event or not.
The default is `false`.

### directionNavigation *{boolean}*
Defines whether the slider has direction navigation (=Left+Right arrow) or not.
The default is `false`.

### directionNavigationPrev *{jQuery Object}*
Defines the left, so the *go to the preveious slide* button.
The default is `''`. *because the directionNavigation is not active, so we dont need it*
*Note: Requires directionNavigation to be true*

### directionNavigationPrev *{jQuery Object}*
Defines the right, so the *go to the next slide* button.
The default is `''`. *because the directionNavigation is not active, so we dont need it*
*Note: Requires directionNavigation to be true*

### controlNavigation *{boolean}*
Defines whether the slider has control navigation (=bullet) or not.
The default is `false`.

### timerBar *{boolean}*
Defines whether the slider has a timer bar (=usually a line which indicates the time before the next slide event) or not.
The default is `false`.

### keyboardNavigation *{boolean}*
Defines whether the slider has keyboard navigation or not.
The default is `false`.

### keyboardNavigationPrev *{number}*
Defines the left, so the *go to the preveious slide* key code.
The default is `37` (=left).
*Note: Requires keyboardNavigation to be true*

### keyboardNavigationNext *{number}*
Defines the right, so the *go to the next slide* button.
The default is `39` (=right).
*Note: Requires keyboardNavigation to be true*

### mouseScrollNavigation *{boolean}*
Defines whether the slider can be controlled by mousewheel events or not.
The default is `false`.

### touchNavigation *{boolean}*
Defines whether the slider can be controlled by touch events or not.
The default is `false`.

### parallaxEffecting *{boolean}*
Defines whether the slides of the slider has a smooth moving effect by mouse move or device gyroscope.
The default is `false`.

### beforeSlide *{anonymous function or array of anonymous functions}*
You can add an `anonymous function` or an array of `anonymous functions` here which will be triggered before the slide event.
The default is `[]`.

### beforeTransition *{anonymous function or array of anonymous functions}*
You can add an `anonymous function` or an array of `anonymous functions` here which will be triggered before the transition.
The default is `[]`.

### afterTransition *{anonymous function or array of anonymous functions}*
You can add an `anonymous function` or an array of `anonymous functions` here which will be triggered after the transition.
The default is `[]`.

### afterSlide *{anonymous function or array of anonymous functions}*
You can add an `anonymous function` or an array of `anonymous functions` here which will be triggered after the slide event.
The default is `[]`.
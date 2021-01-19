import {$events} from "../helpers/events";
import {$dom} from "../helpers/dom";
import {$style} from "../helpers/style";
import {variables as $v} from "../variables";
import {preventDefault} from "../helpers/_service";
import is from 'is_js';


function Parallax(options){

	options = options || {};

	this.nameSpaces = {
		wrapper: options.wrapper || '.parallax',
		layers: options.layers || '.parallax-layer',
		deep: options.deep || 'data-parallax-deep'
	};


	this.init = function() {

		let
			self = this,
			parallaxWrappers = $dom.getAll(this.nameSpaces.wrapper)
		;

		$dom.each(parallaxWrappers, wrapper => {

			$events.add('mousemove', wrapper, event => {

				let
					x = event.clientX,
					y = event.clientY,
					layers = $dom.getAll(self.nameSpaces.layers, wrapper)
				;

				$dom.each(layers, layer => {

					let
						deep = $dom.attr(layer, self.nameSpaces.deep),
						disallow = $dom.attr(layer, 'data-parallax-disallow'),
						itemX = (disallow && disallow === 'x') ? 0 : x / deep,
						itemY = (disallow && disallow === 'y') ? 0 : y / deep
					;

					if(disallow && disallow === 'both') return;

					layer.style.transform = 'translateX(' + itemX + '%) translateY(' + itemY + '%)';
				});
			})

		})

	};

	this.init();

	return this;
}

const debugWindow = function() {

	const {
		append,
		text,
		attr
	} = $dom;

	const {
		set
	} = $style;

	const
		container = $dom.createElement('div', {class: 'parallax-layer debug-container'}),
		mousePositionOutput = $dom.createElement('p', {class: 'debug-mouse-position'}),
		screenSizeOutput = $dom.createElement('p', {class: 'debug-screen-size'}),
		closeButton = $dom.createElement('button', {class: 'debug-close', type: 'button'})
	;

	attr(container, {
		dataParallaxDeep: '500'
	});

	set(container, {
		fontSize: `calc(14px + .25vw)`,
		backgroundColor: '#fefefe',
		padding: '15px',
		position: 'fixed',
		left: 0,
		top: '5vh',
		color: '#000000',
		width: '100%',
		maxWidth: '350px',
		paddingTop: '40px'
	});

	set(closeButton, {
		position: 'absolute',
		width: '34px',
		height: '34px',
		padding: '5px',
		right: '5px',
		top: 0
	});

	$dom.html(closeButton, '<svg class="svg-icon"><use xlink:href="img/sprite.svg#close"></use></svg>');

	append(container, mousePositionOutput);
	append(container, screenSizeOutput);
	append(container, closeButton);
	append(($dom.get('#wrapper') || document.body), container);

	const
		printMousePosition = event => `Mouse position is: x: ${event ? event.pageX : '0'}, y: ${event ? event.pageY : '0'};`,
		printScreenSizes = () => `Screen width: ${window.innerWidth}px; Screen height: ${window.innerHeight}px;`
	;

	text(screenSizeOutput, printScreenSizes());
	text(mousePositionOutput, printMousePosition());

	const setBoxPosition = () => {

		const
			point = $dom.get('img')
		;

		$style.remove(container, 'left top');

		if(point.offsetParent === null) {
			$style.set(container, {display: 'none'});
		} else {
			$style.remove(container, 'display');
			$style.set(container, {
				left: $style.offset(point).left - $style.offset(container).left - (Math.abs(point.offsetWidth - container.offsetWidth) / 2) + 'px',
				top: $style.offset(point).top - (container.offsetHeight) + 'px'
			})
		}

	};


	const mouseMoveHandler = $events.debounce(event => {
		text(mousePositionOutput, printMousePosition(event));
		setBoxPosition();
	});

	setBoxPosition();

	$events
		.add('mousemove', document, mouseMoveHandler)
		.add('click tap', '.debug-close',  () => {
			$style.animate(container, 'fadeOut', {
				hideOnEnd: true,
				onComplete() {
					$events.remove('mousemove', document, mouseMoveHandler);
					$dom.removeClass(container, 'parallax-layer')
				}
			})
		}, {once: true})
		.onResize(() => {
			text(screenSizeOutput, printScreenSizes());
			setBoxPosition();
		});

	return container
};

const ieFixUi = function() {

	const
		$wrapper = $dom.get('.page__wrapper'),
		$footer = $dom.get('.footer', $wrapper),
		$content = $dom.get('.page__content', $wrapper)
	;

	const setSizes = () => {
		$style.remove($content, 'min-height');

		$style.set($content, {
			minHeight: ($wrapper.offsetHeight - $footer.offsetHeight) + 'px'
		})
	};


	setSizes();
	$events.onResize(setSizes)

};

$dom.ready(() => {

	if (is.ie()) ieFixUi();

	const log = function(event) {
		preventDefault(event);

		console.log('event is: ', event);
		console.log('event type is: ' + event.type);
		console.log('context is:', this);
	};

	const
		$wrapper = $dom.get('#wrapper'),
		$header = $dom.get('.header', $wrapper),
		$main = $dom.get('#main', $wrapper),
		$footer = $dom.get('.footer', $wrapper),
		$section = $dom.get('.section', $wrapper),
		$list = $dom.get('.list', $section),
		$title = $dom.get('h1', $section),
		chainOfAnimations = [
			{
				element: $wrapper,
				animationName: 'fadeIn',
				callback(element) {
					console.log(this);
					//this === element
				}
			},
			{
				element: $header,
				animationName: 'fadeInDown',
				callback(element) {
					console.log(this);
					//this === element
				}
			},
			{
				element: $main,
				animationName: 'fadeIn',
				callback(element) {
					console.log(this);
					//this === element
				}
			},
			{
				element: $footer,
				animationName: 'fadeInUp',
				callback(element) {
					console.log(this);
					//this === element
				}
			}
		]
	;

	const debugContainer = debugWindow();

	$style.set(debugContainer, 'opacity', '0');

	$style.animateChain(chainOfAnimations, {
		onComplete() {
			$style.remove(debugContainer, 'opacity');
			$style.animate(debugContainer, 'fadeIn')
		}
	});

	const {open, close, closed} = $v.customEventNames.modal;

	$events

		.add('swipeRight click tap', $list, log)
		.add('swipeLeft click tap', $title, log)
		.delegate
		.on('click tap', '#section-toggle', function() {
			$style.slideToggle('.list', {
				onDown: target => {
					$dom.text(this, 'Section slide up');
					console.log('Toggle up target: ', target);
				},
				onUp: target => {
					$dom.text(this, 'Section slide down');
					console.log('Toggle down target: ', target);
				}
			})
		})
		.on([open, close, closed], document, event => {
			console.log('Modal event type: ', event.type);
			console.log('Modal element: ', event.detail.modal);
		})
	;

	new Parallax();
});





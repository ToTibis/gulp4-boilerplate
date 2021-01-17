import {$events} from "../helpers/events";
import {$dom} from "../helpers/dom";
import {$style} from "../helpers/style";
import {variables as $v} from "../variables";

$dom.ready(() => {

	const log = function(event) {
		(event.originalEvent || event).preventDefault();

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
		chainOfAnimations = [
			{
				element: $wrapper,
				animationName: 'fadeIn',
				callback: console.log
			},
			{
				element: $header,
				animationName: 'fadeInDown',
				callback: console.log
			},
			{
				element: $main,
				animationName: 'fadeIn',
				callback: console.log,
				hideOnEnd: false
			},
			{
				element: $footer,
				animationName: 'fadeInUp',
				callback: console.log,
				hideOnEnd: false
			}
		]
	;

	$style.animateChain(chainOfAnimations);

	$events.delegate.on('click tap', '#section-toggle', function() {
		$style.slideToggle($section, {
			onDown: target => {
				$dom.text(this, 'Section slide up');
				console.log('Toggle up target: ', target);
			},
			onUp: target => {
				$dom.text(this, 'Section slide down');
				console.log('Toggle down target: ', target);
			}
		})
	});

	$events.onResize(e => console.log(e.detail.originalEvent));

	const {open, close, closed} = $v.customEventNames.modal;

	$events.delegate
		.on('click', $list, log)
		.on([open, close, closed], document, event => {
			console.log('Modal event type: ', event.type);
			console.log('Modal element: ', event.detail.modal);
		})

		.off('click', $list, log)


});





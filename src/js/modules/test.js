import {$events} from "../helpers/events";
import {$dom} from "../helpers/dom";
import {$style} from "../helpers/style";

$dom.ready(() => {

	const log = function(event) {
		;(event.originalEvent || event).preventDefault();

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

	$events.delegate.once('tap click swipeRight', 'h1', log);
	$events.add('tap swipeRight', $list, log);

	//$style.animateChain(chainOfAnimations);

	$events.delegate.on('click tap', '#section-toggle', function(event) {
		$style.slideToggle($section, {
			onDown: (e) => {
				$dom.text(this, 'Section slide up')
			},
			onUp: () => {
				$dom.text(this, 'Section slide down')
			}
		})
	});

	$events.onResize(e => console.log(e.detail.originalEvent));

});





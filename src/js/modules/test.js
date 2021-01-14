import {$events} from "../helpers/events";
import {$dom} from "../helpers/dom";
import {$style} from "../helpers/style";
import {$data} from "../helpers/data";
import get from "@babel/runtime/helpers/esm/get";

$dom.ready(() => {

	const log = function(event) {
		;(event.originalEvent || event).preventDefault();
		//
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
		$title = $dom.get('h1', $section),
		$list = $dom.get('.list', $section),
		$listItems = $dom.getAll('li', $list),
		chainOfAnimations = [
			{
				element: $wrapper,
				animationName: 'fadeIn',
				callback: elem => {
					//console.log(elem)
				}
			},
			{
				element: $header,
				animationName: 'fadeInDown',
				callback: elem => {
					//console.log(elem)
				}
			},
			{
				element: $main,
				animationName: 'fadeIn',
				callback: elem => {
					//console.log(elem)
				},
				hideOnEnd: false
			},
			{
				element: $footer,
				animationName: 'fadeInUp',
				callback: elem => {
					//console.log(elem)
				},
				hideOnEnd: false
			}
		]
	;


	//$events.delegate.on('click tap swipeLeft', '.github-link', log);
	//$events.delegate.once('tap', '.github-link', log);
	//$events.add('tap click swipeRight', 'h1', log);
	$events.add('tap swipeRight', $list, log);
	// $events.delegate.on('swipeLeft swipeRight swipeUp swipeDown', $list, log);
	// $events.delegate.on('mouseenter', $title, log);


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


	const img = $dom.get('img');

	$style.set(img, {
		'transform': `translateX(-${$style.offset(img).left}px)`,
		backgroundColor: 'red'
	})



	console.log($events.touchConfigure())
});





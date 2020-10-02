import {gsap} from "gsap";
import $assist from '../../utilities/Assistant';
import {domReady} from '../../utilities/callbacks';

domReady(() => {

	const
		v8Image = $assist('.v8-image').el,
		duration = .75
	;


	gsap.timeline({
		yoyo: true,
		repeat: -1,
		repeatDelay: duration * 10,
		defaults: {duration}
	})
		.to(v8Image, {
			scale: 1.15
		})
		.to(v8Image, {
			scale: 1
		})
		.to(v8Image, {
			scale: .85
		})
		.to(v8Image, {
			scale: 1
		})

});
import {TimelineMax} from "gsap/all";
import {$assist} from '../../utilites/Assistant';
import {domReady} from '../../utilites/Common';


domReady(() => {

	const v8Image = $assist('.v8-image').elsArray[0];
	const duration = .75;


	new TimelineMax({
		yoyo: true,
		repeat: -1,
		repeatDelay: duration * 10,
	})
		.to(v8Image, duration, {
			scale: 1.15
		})
		.to(v8Image, duration, {
			scale: 1
		})
		.to(v8Image, duration, {
			scale: .85
		})
		.to(v8Image, duration, {
			scale: 1
		})

});
import {$assist} from "../../utilites/Assistant";
import {domReady} from "../../utilites/Common";


domReady(() => {

	const list = $assist('.list');
	const listItems = list.find('li')

	listItems
		.addClass('double-active')
		.css({
			color: '#dedede',
			fontSize: '24px'
		})
		.each( el => {
			if ($assist(el).hasClass('active')) {
				console.log('Active item is:', el);

				console.log('And his parent is:', $assist(el).getParent('ul').elsArray[0])
			}
		});


	// console.log(listItems.not('li:first-of-type'))

	listItems.wrap('div', {
		class: 'test-class',
		id: 'test-id'
	})


	// let handler = () => {
	// 	console.log('click handler')
	// };
	//
	// $assist('li', '.list').on('click', handler);


	// setTimeout(() => {
	// 	$assist('li', '.list').off('click', handler);
	// 	console.error('click event delete')
	// }, 5000)


});
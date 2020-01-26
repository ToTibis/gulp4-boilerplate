import {$assist} from '../../utilites/Assistant';
import {domReady} from '../../utilites/Common';


domReady(() => {

	const list = $assist('.list');
	const listItems = list.find('li')

	listItems
		.addClass('js-added-active')
		.css({
			color: '#dedede',
			fontSize: '24px'
		})
		.each( el => {
			if ($assist(el).hasClass('active')) {
				console.log('Active item is from each method with use hasClass() method:', el);

				console.log('And his parent is:', $assist(el).getParent('ul').elsArray[0])
			}
		});


	console.log('listItems', listItems);

	console.log('listItems.not(li:first-of-type)', listItems.not('li:first-of-type'));


	console.log(list.getParent('body'))

	listItems.each(el => {

		let p = document.createElement('p');

		p.innerHTML = el.innerHTML;

		el.innerHTML = '';

		el.appendChild(p);

		$assist(p).wrap('div', {
			class: 'wrap-method-class',
			id: 'wrap-method-id'
		})

	});


	let c = 0;

	let handler = () => {
		c++;
		if (c === 5) {
				$assist('li', '.list').off('click', handler);
				console.error('click on list items handler delete')
		} else {
			console.log('click on list items handler')
		}

	};

	$assist('li', '.list').on('click', handler);


});
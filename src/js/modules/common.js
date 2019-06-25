import {variables as $v} from '../modules/variables';
import {getRandomInt} from '../utilites/helpers';

$(function () {

	setTimeout(() => {
		alert('ready to work');
	}, 1000);

	console.log(getRandomInt(0, 10));
	console.log(getRandomInt(0, 10));
	console.log($v);
});
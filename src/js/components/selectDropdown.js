import {$dom} from '../helpers/dom';
import {$events} from '../helpers/events';
import {isElement} from '../helpers/_utilities';
import variables from '../variables';
import Component from '../classes/Component';

const {
	attr,
	get,
	getAll,
	html,
	callAll,
	hasClass,
	removeClass,
	addClass
} = $dom;


const
  rootSelector = '[data-select-dropdown]',
  buttonSelector ='[data-select-dropdown-button]',
  menuSelector ='[data-select-dropdown-menu]',
  selectedOutputSelector = '[data-select-dropdown-selected]',
  optionSelector ='[data-select-dropdown-option]',
  outputSelector ='[data-select-dropdown-output]'
;

export default function (valueAttr = 'data-value') {

	const selectedState = variables.classNames.selected;

	function checkOptions(root) {

		const
			options = getAll(optionSelector, root),
			button = get(buttonSelector, root),
      buttonContent = get(selectedOutputSelector, root),
			output = get(outputSelector, root),
			selectedOption = options.find(option => hasClass(option, selectedState))
		;

		if (isElement(selectedOption)) {
			attr(button, valueAttr, attr(selectedOption, valueAttr));
			html(buttonContent, html(selectedOption));

			const val = attr(selectedOption, valueAttr);

			output.value = val;

			$events.emit(variables.customEventNames.selectDropdownSelected, {
				value: val,
			}, root)
		}
	}

	function handleClick(event) {
		const
			option = event.target.closest(optionSelector),
			options = getAll(optionSelector, this)
		;

		if (isElement(option)) {
			removeClass(options.filter(opt => opt !== option), selectedState);
			addClass(option, selectedState);

			checkOptions(this);
		}
	}

	function handleToggle() {
		$dom[hasClass(get(menuSelector, this), 'show')  ? 'removeClass' : 'addClass'](this, variables.classNames.focused)
	}

	return new Component({
		name: 'selectDropdown',
    requiredTargets: rootSelector,
		onInit() {
			callAll(rootSelector, checkOptions);

			$events.delegate
				.on('click', rootSelector, handleClick)
				.on('show.bs.dropdown', rootSelector, handleToggle)
				.on('hide.bs.dropdown', rootSelector, handleToggle)
		},
		onDestroy() {
			$events.delegate
				.off('click', rootSelector, handleClick)
				.off('show.bs.dropdown', rootSelector, handleToggle)
				.off('hide.bs.dropdown', rootSelector, handleToggle)
			;
		}
	})
}

import {toCamelCase, isElement, warn} from '../helpers/_utilities';
import {$data} from '../helpers/data';
import is from 'is_js';
import {$events} from '../helpers/events';
import Model from './Model';
import Component from './Component';
import {formValidation} from '../components/formValidation';
import modal from '../components/modal';
import toasts from '../components/toasts';
import lazyLoad from '../components/lazyLoad';
import selectDropdown from '../components/selectDropdown';
import {$dom} from '../helpers/dom';
import {$style} from '../helpers/style';
import {$ui} from '../helpers/ui';
import {Modal, Collapse, Dropdown, Offcanvas} from 'bootstrap/dist/js/bootstrap.esm';
const {merge} = $data;

export default class Page extends Model {
	#defaults = {
		debug: true
	};

	#spritePathAttr = 'data-sprite-path';
	#spritePathAsDataset = toCamelCase(this.#spritePathAttr.replace('data-', ''));

	constructor(options) {
		super(options);

		this.options = merge(this.#defaults, options);

		if (is.not.domNode(this.rootEl)) {
			this.options.debug && warn(`Instance Page with name "${this.options.name}" has no root element provided`, 'Class Page');
			return;
		}

		this.components = {};
		this.resizeDependentMethods = [];
		this.helpers = {
			'dom': $dom,
			'is': is,
			'events': $events,
			'style': $style,
			'ui': $ui
		};
		this.bootstrap = {Modal, Collapse, Dropdown, Offcanvas};
		this.spritePath = this.rootEl.dataset[`${this.#spritePathAsDataset}`];

		if (is.undefined(this.spritePath)) {
			this.options.debug && warn(
				`Path to svg-sprite is not provided to root element as "${this.#spritePathAttr}" attribute`,
				'Class Page, constructor'
			)
		} else {
			this.rootEl.removeAttribute(`${this.#spritePathAttr}`)
		}
	}

	get rootEl(){
		const
			{rootElementId} = this.options,
			el = document.getElementById(rootElementId)
		;

		if (is.string(rootElementId) && Boolean(rootElementId) && isElement(el)) return el;

		return null
	};

	addComponent(fn, initialArgs = []) {
		if (is.function(fn)) {

			const component = fn.call(this, ...initialArgs);

			if (component instanceof Component) {
				if (component?.options?.name && is.undefined(this.components[component.options.name])) {
					this.components[component.options.name] = component;

					if (!component?.initialized && is.function(component.init)) component.init()
				}
			} else {
				this.options.debug && warn(
					`The name parameter was not passed to the Component an "${this.options.name}" Page`,
					'Class Page, addComponent method'
				)
			}
		}

		return this;
	}

	destroyComponent(name) {
		if (this.components.hasOwnProperty(name)) {
			const component = this.components[name];

			if (component instanceof Component && component.initialized && is.function(component.destroy)) {
				component.destroy();

				delete this.components[name];
			}
		}

		return this;
	};

	removeComponents(arg) {
		if (is.undefined(arg)) {
			Object.entries(this.components).forEach(([name, component]) => this.destroyComponent(name));
		} else if (is.array(arg) && arg.length > 0) {
			arg.forEach(componentName => this.destroyComponent(componentName))
		} else if (is.string(arg) && arg.length > 0) {
			this.destroyComponent(arg)
		}

		return this;
	}

	addResizeDependentMethod(method) {
		if (is.function(method)) {

			if (this.resizeDependentMethods.indexOf(method) < 0) {
				$events.resize('on', method);
				this.resizeDependentMethods.push(method);
			}

		}
		return this
	}

	removeResizeDependentMethod(method) {

		if (is.undefined(method)) {
			if (this.resizeDependentMethods.length > 0) {
				this.resizeDependentMethods = this.resizeDependentMethods.filter(m => {
					$events.resize('off', m);
					return false
				})
			}
			return this;
		}

		const indOf = this.resizeDependentMethods.indexOf(method);
		if (indOf !== -1) {
			this.resizeDependentMethods = this.resizeDependentMethods.splice(indOf, 1);
			$events.resize('off', method);
		}

		return this
	}

	init() {
		try {
			this
				.addComponent(lazyLoad, [200])
				.addComponent(formValidation)
				.addComponent(modal)
				.addComponent(toasts)
				.addComponent(selectDropdown)
			;

			super.init(this);
		} catch (e) {console.error(e)}

		return this;
	}

	destroy() {
		try {
			this.removeComponents();
			this.removeResizeDependentMethod();

			super.destroy(this);
		} catch (e) {console.error(e)}
		return this;
	}
}

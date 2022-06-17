import Model from './Model';
import {$data} from '../helpers/data';
import {$dom} from '../helpers/dom';
import is from 'is_js';

const {merge} = $data;
const {exist, getAll} = $dom;

export default class Component extends Model {
	#defaults = {
		requiredTargets: null
	};

	constructor(options) {
		super(options);

		this.options = merge(this.#defaults, options);
		this.initialized = false;
	}

	#targetsExist = is.array(this.options.requiredTargets)
		? this.options.requiredTargets.every(selector => exist(selector))
		: exist(this.options.requiredTargets);

	#needInitialization = this.#targetsExist || this.options.requiredTargets === 'STAND_ALONE';

	get targets() {
		if (this.#targetsExist && this.options.requiredTargets !== 'STAND_ALONE')
			return getAll(this.options.requiredTargets);

		return []
	}

	init() {
		if (this.#needInitialization) {
			try {
				super.init();
				this.initialized = true
			} catch (e) {console.error(e)}
		}
	}
	destroy() {
		if (this.#needInitialization) {
			try {
				super.destroy();
				this.initialized = false
			} catch (e) {console.error(e)}
		}
	}
}

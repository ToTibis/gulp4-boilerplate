import Model from './Model';
import {$data} from '../helpers/data';
import {$dom} from '../helpers/dom';

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

	#targetsExist = exist(this.options.requiredTargets);
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
			} catch (e) {console.log(e)}
		}
	}
	destroy() {
		if (this.#needInitialization) {
			try {
				super.destroy();
				this.initialized = false
			} catch (e) {console.log(e)}
		}
	}
}

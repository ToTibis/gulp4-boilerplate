import Model from './Model';
import {$data} from '../helpers/data';
import {$dom} from '../helpers/dom';

const {merge} = $data;
const {exist} = $dom;

export default class Component extends Model {
  #defaults = {
    requiredTargets: null
  };

  constructor(options) {
    super(options);

    this.options = merge(this.#defaults, options);
    this.initialized = false;
  }

  #needInitialization = (
    exist(this.options.requiredTargets)
    || this.options.requiredTargets === 'STAND_ALONE'
  );

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

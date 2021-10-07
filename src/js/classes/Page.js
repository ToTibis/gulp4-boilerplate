import {forIn, warn} from '../helpers/_utilities';
import {$data} from '../helpers/data';
import is from 'is_js';
import {$events} from '../helpers/events';
import Model from './Model';
import {lazyLoad} from '../components/lazyLoad';
import Component from './Component';
import {formValidation} from '../components/formValidation';
import modal from '../components/modal';
import toasts from '../components/toasts';
import variables from '../variables';

const {merge} = $data;
const {globalSettingsAttrName} = variables;

export default class Page extends Model {
  #components = {};


  constructor(options) {

    super(options);

    this.initialized = true;

    if (is.not.domNode(this.rootElement)) {
      if (this.options.debug) {
        warn(`Instance Page with name "${this.name}" has no root element provided`, 'Class Page')
      }
      this.initialized = false;
      return;
    }

    this.defaults = {
      resizeMethods: []
    };

    this.options = merge(this.defaults, options);

    this[globalSettingsAttrName] = this.rootEl.dataset[globalSettingsAttrName] && JSON.parse(this.rootEl.dataset[globalSettingsAttrName]);

    if (is.undefined(this[globalSettingsAttrName])) {
      warn(`Global settings is not provided to root element as "data-${globalSettingsAttrName}" attribute`, 'Class Page')
    } else {
      this.rootEl.removeAttribute(`data-${globalSettingsAttrName}`)
    }

    this
      .addComponent(lazyLoad, [50, 'data-error'])
      .addComponent(formValidation)
      .addComponent(modal)
      .addComponent(toasts)
    ;
  }

  addComponent(fn, initialArgs = []) {
    if (is.function(fn)) {

      const component = fn.call(this, ...initialArgs);

      if (component instanceof Component) this.#components[component.name] = component;

    }
    return this;
  }

  processComponents(action, components = this.#components) {
    forIn(components, (key, component) => {
      if (is.undefined(this[key])) this[key] = component;

      if (is.function(component[action])) {
        component[action]()
      }
    })
  }

  resizeDependentMethods(action) {
    return this.options.resizeMethods.map(method => {
      method = method.bind(this);
      switch (action) {
        case 'add':
          method.call(this);
          $events.resize('on', method);
          break;

        case 'remove':
          $events.resize('off', method);
          break;
      }
      return method
    });
  }

  listeners(action) {
    switch (action) {
      case 'add':

        break;
      case 'remove':

        break;
    }
  }

  init() {
    this.listeners('add');
    this.processComponents('init');
    this.resizeDependentMethods('add');

    super.init(this);
    return this;
  }

  destroy() {
    this.listeners('remove');
    this.processComponents('destroy');
    this.resizeDependentMethods('remove');

    this.initialized = false;

    super.destroy(this);
    return this;
  }
}

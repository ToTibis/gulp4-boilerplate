import {forIn, generateId, warn} from '../helpers/_utilities';
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
import selectDropdown from '../components/selectDropdown';

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
      .addComponent(selectDropdown)
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

  processResizeMethod(action, method) {
    switch (action) {
      case 'add':
        method.call(this);
        $events.resize('on', method);
        break;

      case 'remove':
        $events.resize('off', method);
        break;
    }
  }

  resizeDependentMethods(action) {
    this.options.resizeMethods = this.options.resizeMethods.map(target => {

      if (is.function(target)) {
        this.processResizeMethod(action, target);

        if (action === 'add') {
          const fnName = Boolean(target.name) ? target.name : generateId();

          return {
            [fnName]: target,
            processed: true
          }
        }

        return {}
      } else {
        return action === 'add' ? target : {};
      }
    });
  }

  addResizeDependMethod(method) {

    this.options.resizeMethods = [...this.options.resizeMethods, method];

    this.resizeDependentMethods('add');
  }

  removeResizeDependMethod(method) {

    if (Boolean(method.name)) {
      const target = this.options.resizeMethods.find(obj => {
        return obj.hasOwnProperty(method.name) && is.function(obj[method.name])
      });

      if (Boolean(target) && target.processed && is.function(target[method.name])) {
        this.processResizeMethod('remove', method);
        this.options.resizeMethods = this.options.resizeMethods.filter(m => m !== target);
      } else {
        warn('Required method not found!', 'Page class, removeResizeDependMethod')
      }
    } else {
      warn('When deleting a resize depend method please use named functions', 'Page class, removeResizeDependMethod')
    }
  }

  init() {
    this.processComponents('init');
    this.resizeDependentMethods('add');

    super.init(this);
    return this;
  }

  destroy() {
    this.processComponents('destroy');
    this.resizeDependentMethods('remove');

    this.initialized = false;

    super.destroy(this);
    return this;
  }
}

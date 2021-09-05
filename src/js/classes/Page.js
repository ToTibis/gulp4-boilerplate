import {loop, warn} from '../helpers/_utilities';
import {$data} from '../helpers/data';
import is from 'is_js';
import {$events} from '../helpers/events';
import Model from './Model';
import {lazyLoad} from '../components/lazyLoad';
import Component from './Component';
import {formValidation} from '../components/formValidation';
import modal from '../components/modal';
import toasts from '../components/toasts/toasts';
const {merge} = $data;

export default class Page extends Model {

  constructor(options) {

    super(options);

    this.created = true;

    if (is.not.domNode(this.rootElement)) {
      if (this.options.debug) {
        warn(`Instance Page with name "${this.name}" has no root element provided`, 'Page-class')
      }
      this.created = false;
      return;
    }

    this.defaults = {
      resizeMethods: []
    };

    this.options = merge(this.defaults, options);
    this.carousels = this.options.carousels || [];
    this.components = [];

    this
      .addComponent(lazyLoad, [50, 'data-error'])
      .addComponent(formValidation)
      .addComponent(modal)
      .addComponent(toasts)
    ;
  }

  addComponent(fn = null, initialArgs = []) {
    if (is.function(fn)) {

      const component = fn.call(this, ...initialArgs);

      if (component instanceof Component) {
        this.components.push({instance: component, args: initialArgs});
      }

    }
    return this;
  }

  processComponents(action, components = this.components) {
    if (components.length > 0) {

      components.filter(component => {

        const {instance, args} = component;
        const {name} = instance;

        if (is.undefined(this[name])) this[name] = instance;

        if (is.function(this[name][action])) {
          this[name][action]();
          return {
            instance: this[name],
            initialArgs: args
          }
        }

        return false
      });
    }
    return []
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

    this.created = false;

    super.destroy(this);
    return this;
  }
}

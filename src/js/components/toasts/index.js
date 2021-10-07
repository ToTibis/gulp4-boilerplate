import {$data} from '../../helpers/data';
import Component from '../../classes/Component';
import Toastify from './Toastify';
import variables from '../../variables';

const {merge} = $data;
const {globalSettingsAttrName} = variables;

export default function index(settings = {}) {

  const defaults = {
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    escapeMarkup: false
  };

  const
    pluginOptions = merge(defaults, settings),
    icons = {
      success: 'check',
      warning: 'exclamation',
      info: 'info',
      danger: 'warning'
    }
  ;

  const $Page = this;

  return new Component({
    name: 'toast',
    requiredSelector: undefined,
    onInit() {
      this.show = function (text = '', status = 'info') {
        return Toastify(merge(pluginOptions, {
          text,
          className: 'status--'+status,
          icon: `<svg class="svg-icon"><use xlink:href="${$Page[globalSettingsAttrName].images}/sprite.svg#${icons[status]}"></use></svg>`
        })).showToast();
      }
    }
  })
}
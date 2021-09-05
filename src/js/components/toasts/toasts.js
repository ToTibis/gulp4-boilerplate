import {$data} from '../../helpers/data';
import Component from '../../classes/Component';
import Toastify from './Toastify';

const {merge} = $data;

export default function toasts(settings = {}) {

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

  return new Component({
    name: 'toast',
    requiredSelector: undefined,
    onInit() {
      this.show = function (text = '', status = 'info') {
        return Toastify(merge(pluginOptions, {
          text,
          className: 'status--'+status,
          icon: `<svg class="svg-icon"><use xlink:href="img/sprite.svg#${icons[status]}"></use></svg>`
        })).showToast();
      }
    }
  })

}
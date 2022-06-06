import {$data} from '../../helpers/data';
import Component from '../../classes/Component';
import './Toastify';

const {merge} = $data;

export default function(settings = {}) {

  const defaults = {
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'left',
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
    requiredTargets: 'STAND_ALONE',
    onInit() {

      this.show = function (text = '', status = 'info') {

        return window.Toastify(merge(pluginOptions, {
          text,
          close: false,
          className: 'status--'+status,
          icon: `<svg class="svg-icon"><use xlink:href="${$Page.spritePath}sprite.svg#${icons[status]}"></use></svg>`
        })).showToast();
      }
    }
  })
}

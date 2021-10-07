import Component from '../../classes/Component';
import {$dom} from '../../helpers/dom';
import is from 'is_js';
import {forIn, generateId, warn} from '../../helpers/_utilities';
import bootstrapComponents from '../bootstrap'
import notify from './notify'

const {
  get,
  exist,
  callAll
} = $dom;

const {Modal} = bootstrapComponents;

export default function modal(
  modalSelector = '.js-modal'
) {

  const $Page = this;

  return new Component({
    name: 'modal',
    requiredSelector: undefined,
    onCreate() {
      this.modals = {};
    },
    onInit() {

      this.modalIsCashed = modalId => this.modals.hasOwnProperty(modalId);

      this.checkElementExist = (id, cb = null) => {
        if (exist('#'+id)) {
          if (is.function(cb)) {
            cb(get('#'+id))
          }
        } else {
          warn(`Modal element by id "${id}" is not found`, 'Modal Component')
        }
      };

      this.open = id => {
        this.checkElementExist(id, elem => {
          if (this.modalIsCashed(elem.modalId))
            this.modals[elem.modalId].show()
        })
      };

      this.close = (id = null) => {
        if (is.null(id)) {
          forIn(this.modals, (_, modal) => modal.hide())
        } else {
          this.checkElementExist(id, elem => {
            if (this.modalIsCashed(elem.modalId))
              this.modals[elem.modalId].hide()
          })
        }
      };

      this.notify = notify.call($Page);

      if (exist(modalSelector)) {
        callAll(modalSelector, modalEl => {
          modalEl.modalId = generateId();

          this.modals[modalEl.modalId] = new Modal(modalEl);
        });
      }


      this.notify.addListeners();
    },
    onDestroy() {

      this.close();
      this.notify.removeListeners();
      this.modals = {};

      this.open = Function.prototype;
      this.close = Function.prototype;
    },
  })
}
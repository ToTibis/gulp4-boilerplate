import Component from '../../classes/Component';
import {$dom} from '../../helpers/dom';
import is from 'is_js';
import {forIn, generateId, warn} from '../../helpers/_utilities';
import notify from './notify'

const {get, exist, callAll} = $dom;

const modalSelector = '.js-modal';

export default function modal() {

  const $Page = this;

  const createModal = modalEl => {
    modalEl.modalId = generateId();

    return {instance: $Page.bootstrap.Modal.getOrCreateInstance(modalEl), id: modalEl.modalId}
  };

  return new Component({
    name: 'modal',
    requiredTargets: 'STAND_ALONE',
    onCreate() {
      this.modals = {};
    },
    onInit() {
      this.notify = notify.call($Page, this);

      this.modalIsCashed = id => this.modals.hasOwnProperty(id);

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
          if (this.modalIsCashed(elem.modalId)) {
            this.modals[elem.modalId].show()
          } else {
            const {instance,id} = createModal(elem);

            this.modals[id] = instance;

            this.modals[id].show()
          }
        })
      };

      this.close = (id = null) => {
        this.notify.hide();

        if (is.null(id)) {
          forIn(this.modals, (_, modal) => modal.hide())
        } else {
          this.checkElementExist(id, elem => {
            if (this.modalIsCashed(elem.modalId)) {
              this.modals[elem.modalId].hide()
            } else {
              const {instance,id} = createModal(elem);

              this.modals[id] = instance;

              this.modals[id].hide()
            }
          })
        }
      };


      if (exist(modalSelector)) {
        callAll(modalSelector, modalEl => {
          const {instance,id} = createModal(modalEl);
          this.modals[id] = instance;
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
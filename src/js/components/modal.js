import Component from '../classes/Component';
import {$dom} from '../helpers/dom';
import is from 'is_js';
import {isElement, warn} from '../helpers/_utilities';
import {$events} from '../helpers/events';

const {
  createElement,
  createElementFromString,
  append,
  text,
  get,
  remove,
  exist,
  callAll
} = $dom;

export default function modal(
  dynamicModalId = 'js-dynamic-modal',
  modalBodyClassName = 'modal-body',
  modalSelector = '.js-modal',
  embedPoint = document.body,
  closeText = 'Закрыть',
  closeIcon = 'close'
) {

  const $Page = this;

  const
    modalEl = () => {
      return createElement('div', {
        class: 'modal js-modal fade modal--dynamic',
        id: dynamicModalId,
        ariaHidden: 'true'
      })
    },
    dialogEl = () => {
      return createElement('div', {
        class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable'
      })
    },
    contentEl = () => {
      return createElement('div', {
        class: 'modal-content'
      })
    },
    bodyEl = () => {
      return createElement('div', {
        class: modalBodyClassName
      })
    },
    buttonCloseEl = () => {
      return createElement('button', {
        class: 'modal-close ms-auto d-flex align-items-center',
        type: 'button',
        dataBsDismiss: 'modal',
        ariaLabel: 'Close'
      })
    },
    buttonCloseTextEl = () => {
      return text(createElement('span', {
        class: 'me-3'
      }), closeText)
    },
    buttonCloseIcon = () => createElementFromString(`<svg class="svg-icon"><use xlink:href="img/sprite.svg#${closeIcon}"></use></svg>`),
    titleEl = content => {
      return text(createElement('h3', {
        class: 'title title--sub-large mb-4'
      }), content)
    }
  ;

  const sayHelloByResize = () => console.log('Hello by resize from modal component');

  $Page.options.resizeMethods =  [sayHelloByResize, ...$Page.options.resizeMethods];

  return new Component({
    name: 'modalController',
    requiredSelector: undefined,
    onCreate() {

      this.open = function (id) {
        const el = get('#'+id);

        if (el.Modal instanceof $Page.Bootstrap.Modal) el.Modal.show();
      };

      this.close = function (id = null) {
        if (exist('#'+id)) {
          get('#'+id).Modal.hide()
        } else if (is.null(id)) {
          callAll(modalSelector, el => el.Modal instanceof $Page.Bootstrap.Modal && el.Modal.hide());
        }

        this.notify.hide(dynamicModalId)
      };

      this.notify = {
        currentModal: null,
        elId: dynamicModalId,
        messagePrinted: false,
        createTemplate() {
          const
            root = modalEl(),
            dialog = dialogEl(),
            content = contentEl(),
            body = bodyEl(),
            close = buttonCloseEl(),
            closeText = buttonCloseTextEl(),
            closeIcon = buttonCloseIcon()
          ;

          append(close, closeText);
          append(close, closeIcon);

          append(dialog, content);
          append(content, close);

          append(content, body);

          append(root, dialog);

          return root;
        },
        removeTemplate(event) {

          if (event.target.closest('#'+this.elId)) {
            const modalEl = get('#'+this.elId);

            if (isElement(modalEl)) remove(modalEl);
            this.currentModal = null;
            this.messagePrinted = false;
          }

        },
        show(options = {}) {
          if (!$Page.created) return null;

          append(embedPoint, this.createTemplate());

          const modalEl = get('#'+this.elId);

          if (is.null(this.currentModal)) {
            this.currentModal = new $Page.Bootstrap.Modal(modalEl);
          }

          const {title, subtitle, markup} = options;
          const body = get(`#${this.elId} .${modalBodyClassName}`);
          let isMarkup = false;

          try {
            createElementFromString(markup);
            isMarkup = true
          } catch (e) {}

          if (!this.messagePrinted) {
            if (Boolean(title) && is.string(title) && is.not.empty(title)) {
              append(body, titleEl(title))
            }

            if (Boolean(subtitle) && is.string(subtitle) && is.not.empty(subtitle)) {
              append(body, text(createElement('p'), subtitle))
            }

            if (isMarkup) append(body, createElementFromString(markup));

            this.messagePrinted = true
          }

          if (Boolean(title) || Boolean(subtitle) || isMarkup) {
            this.currentModal.show();
          } else {
            warn('Title or subtitle is not provided to show method', 'Component modalController.notify')
          }

          return modalEl
        },
        hide() {
          if (this.currentModal instanceof $Page.Bootstrap.Modal) {
            this.currentModal.hide();
            this.currentModal = null;
          }
        },
      };

      this.notify.removeTemplate = this.notify.removeTemplate.bind(this.notify)
    },
    onInit() {
      if (exist(modalSelector))
        callAll(modalSelector, modalEl => modalEl.Modal = new $Page.Bootstrap.Modal(modalEl));

      $events.delegate.on('hidden.bs.modal', document, this.notify.removeTemplate);
    },
    onDestroy() {
      this.close();

      if (exist(modalSelector))
        callAll(modalSelector, modalEl => modalEl.Modal = undefined);

      $events.delegate.off('hidden.bs.modal', document, this.notify.removeTemplate);
    },
  })
}
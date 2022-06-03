import templates from './templates';
import {generateId} from '../../../helpers/_utilities';
import {$dom} from '../../../helpers/dom';
import is from 'is_js';
import {$data} from '../../../helpers/data';
import {$events} from '../../../helpers/events';

const {append, get, createElement, text, createElementFromString, remove, hasClass} = $dom;

export default function (ModalComponent, opts = {
  embedPoint: document.body,
  closeText: 'Закрыть',
  closeIcon: 'close'
}) {

  let currentModal = null;
  const $Page = this;
  const {Modal} = $Page.bootstrap;

  let
    show = (p = {}) => {

      if (!ModalComponent.initialized) return currentModal;

      const defaults = {
        title: {
          tag: 'h2',
          attrs: {},
          content: false
        },
        description: {
          tag: 'p',
          attrs: {},
          content: false
        },
        markup: false
      };

      append(opts.embedPoint, createTemplate());

      const modalEl = document.getElementById(id);

      if (hasClass(modalEl, 'show')) return;

      if (is.null(currentModal)) currentModal = new Modal('#'+id);

      const
        payload = $data.merge(defaults, p),
        {title, description, markup} = payload,
        body = get('.modal-body', modalEl)
      ;

      if (checkContent(markup)) {
        append(body, createElementFromString(markup));
        currentModal.show();
        return currentModal;
      }

      let isMustToShown = true;

      if (checkContent(title.content)) {
        append(body, text(createElement(title.tag, {...title.attrs}), title.content));
      } else {isMustToShown = false}

      if (checkContent(description.content)) {
        append(body, text(createElement(description.tag, {...description.attrs}), description.content))
      }

      if (isMustToShown) currentModal.show();

      return currentModal;
    },
    hide = () => {
      if (currentModal instanceof Modal) {
        currentModal.hide();
        currentModal = null;
      }
    }
    ;


  const
    id = generateId(false),
    createTemplate = () => {
      const
        modal = templates.modal(id),
        dialog = templates.dialog(),
        content = templates.content(),
        body = templates.body(),
        close = templates.close(),
        closeText = templates.closeText(opts.closeText),
        closeIcon = templates.closeIcon($Page.spritePath, opts.closeIcon)
      ;

      append(close, closeText);
      append(close, closeIcon);
      append(dialog, content);
      append(content, close);
      append(content, body);
      append(modal, dialog);

      return modal;
    },
    checkContent = content => content && is.string(content) && is.not.empty(content),
    removeTemplate = event => {
      const modalEl = event.target.closest('#'+id);

      if (modalEl && !hasClass(modalEl, 'show')) {
        remove(get('#'+id));
        currentModal = null;
      }
    },
    addListeners = () => {
      $events.delegate.on('hidden.bs.modal', '#'+id, removeTemplate);
    },
    removeListeners = () => {
      $events.delegate.off('hidden.bs.modal', '#'+id, removeTemplate);
    }
  ;


  return {show, hide, addListeners, removeListeners}
}

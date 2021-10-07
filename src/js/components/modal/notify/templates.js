import {$dom} from '../../../helpers/dom';

const {
  createElement,
  createElementFromString
} = $dom;

export default {
  modal: id => {
    return createElement('div', {
      class: 'modal js-modal fade modal--dynamic',
      ariaHidden: 'true',
      id,
    })
  },
  dialog: () => createElement('div', {class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable'}),
  content: () => createElement('div', {class: 'modal-content'}),
  body: () => createElement('div', {class: 'modal-body'}),
  close: () => {
    return createElement('button', {
      class: 'modal-close ms-auto d-flex align-items-center',
      type: 'button',
      dataBsDismiss: 'modal',
      ariaLabel: 'Close'
    })
  },
  closeText: text => $dom.text(createElement('span', {class: 'me-3'}), text),
  closeIcon: (iconPath, iconName) => createElementFromString(`<svg class="svg-icon"><use xlink:href="${iconPath}/sprite.svg#${iconName}"></use></svg>`)
}









import {$data} from "../helpers/data";
import {$events} from "../helpers/events";
import {$dom} from "../helpers/dom";
import {$style} from "../helpers/style";
import {variables as $v} from "../variables";

export default class ModalController {
	constructor(options = {}) {

		this.defaults = {
			modalsSelector: '.page__modal',
			openTrigger: 'data-modal-open',
			closeTrigger: 'data-modal-close',
			activeClass: 'is-active',
			overlap: false
		};

		this.options = $data.deepAssign(this.defaults, options);
		this.activeModal = null;
		this.opened = [];
		this.overlap = this.options.overlap;

		this.bindingEvents();
	}

	_change(action, modal) {
		switch (action) {
			case 'show':
				$dom.addClass(modal, this.options.activeClass);
				$style.set(modal, 'display', 'block');
				$dom.attr(modal, 'aria-hidden', 'false');

				this.opened.push(modal);

				$events.emit($v.customEventNames.modal.open, modal, {modal});
				break;

			case 'hide':

				$dom.attr(modal, 'aria-hidden', 'true');

				$events
					.emit($v.customEventNames.modal.close, modal, {modal})
					.add('animationend', modal, () => {
						$dom.removeClass(modal, this.options.activeClass);
						$style.set(modal, 'display', 'none');
						$events.emit($v.customEventNames.modal.closed, modal, {modal})
					}, {
						once: true
					});

				this.opened = this.opened.filter(item => item !== modal);

				break;
		}
	}

	open(modalId) {

		this.activeModal = $dom.get('#' + modalId);

		if (this.opened.length > 0 && !this.overlap) this._change('hide', this.opened[0]);

		this._change('show', this.activeModal);

		if (this.opened.length > 1 && this.overlap) {
			let activeModals = $dom.getAll(this.options.modalsSelector).filter(modal => {
				return $dom.hasClass(modal, this.options.activeClass) && modal !== this.activeModal
			});
			$dom.insertAfter(this.activeModal, activeModals[activeModals.length - 1]);
		}

	}

	close() {

		if (this.opened.length > 0) {

			if (this.opened.length > 1) {
				this.activeModal = this.opened[this.opened.length - 1]
			} else if (this.opened.length === 1) {
				this.activeModal = this.opened[0];
			}

			this._change('hide', this.activeModal);

		}

	}

	bindingEvents() {

		let
			openSelector = `[${this.options.openTrigger}]`,
			closeSelector = `[${this.options.closeTrigger}]`,
			$self = this
		;

		$events.delegate
			.on('click tap', openSelector, function () {
				$self.open($dom.attr(this, $self.options.openTrigger))
			})
			.on('click tap',  closeSelector, this.close.bind(this))
		;

		return this;
	}

}
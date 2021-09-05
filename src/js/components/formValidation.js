import Component from '../classes/Component';
import {$dom} from '../helpers/dom';
import {$events} from '../helpers/events';
import variables from '../variables';
import FormValidator from '@yaireo/validator'
import {isElement} from '../helpers/_utilities';

const {
  callAll,
  attr,
  get,
  remove,
  addClass,
  removeClass,
  exist
} = $dom;

export function formValidation(
  formSelector = '.js-form-validate',
  formGroupSelector = '.js-group-validate',
  formFieldSelector = '.js-field-validate',
  notifyClassName = 'form__group-notify',
  needValidateClassName = 'is-need-validate'
) {
  return new Component({
    name: 'formValidation',
    requiredSelector: formSelector,
    onCreate() {
      this.validator = null;
    },
    onInit() {

      this.validator = new FormValidator({
        classes: {
          item: formGroupSelector.replace('.', ''),
          bad: variables.classNames.invalid,
          alert: notifyClassName
        },
        texts: {
          invalid         : 'Некорректное значение',
          short           : 'input is too short',
          long            : 'input is too long',
          checked         : 'Должно быть отмечено',
          empty           : 'Пожалуйста, заполните это поле',
          select          : 'Please select an option',
          number_min      : 'too low',
          number_max      : 'too high',
          url             : 'invalid URL',
          number          : 'not a number',
          email           : 'Некорректный e-mail',
          email_repeat    : 'emails do not match',
          date            : 'invalid date',
          time            : 'invalid time',
          password_repeat : 'Пароли не совпадают',
          no_match        : 'no match',
          complete        : 'Ввод не завершён'
        }
      });

      attr(formSelector, 'novalidate', '');

      this.checkField = formGroup => {
        if (formGroup instanceof Event) {
          const {target} = formGroup;

          if (isElement(target)) formGroup = target.closest(formGroupSelector)
        }

        const field = get(formFieldSelector, formGroup);

        if (isElement(field)) {
          const {valid, error} = this.validator.checkField(field);
        }
      };

      this.handleForm = event => {
        const form = event.target.closest(formSelector);

        event.preventDefault();

        callAll(formGroupSelector, this.checkField, form);
        if (!this.validator.checkAll(form).valid) event.preventDefault();
      };

      callAll(formGroupSelector, el => addClass(el, needValidateClassName));

      $events
        .add('focus blur', formFieldSelector, this.checkField)
        .delegate
          .on('submit', formSelector, this.handleForm)
          .on('input change', formGroupSelector, this.checkField)
      ;
    },
    onDestroy() {
      this.validator = null;

      callAll(formSelector, form => {
        form.removeAttribute('novalidate');
        if (exist(formGroupSelector, form)) callAll(formGroupSelector, el => removeClass(el, needValidateClassName), form);
        if (exist('.'+notifyClassName, form)) callAll('.'+notifyClassName, el => remove(el), form);
      });


      $events.delegate
        .off('submit', formSelector, this.handleForm)
        .off('input change', formGroupSelector, this.checkField)
      ;
    },
  })
}
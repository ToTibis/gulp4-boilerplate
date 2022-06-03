const variables = {
	gsapDefaultDuration: .25,
  carouselDefaultDuration: 800,
	resizeDebounce: 100,
	debugLogs: true,
	debugLogsDisabledNotify: true,
	customEventNames: {
		resize: 'resize-done',
    selectDropdownSelected: 'select-dropdown-selected'
	},
  classNames: {
    disabled: 'is-disabled',
    hover: 'is-hover',
    active: 'is-active',
    involved: 'is-involved',
    lazyLoading: 'is-loading',
    lazyPreloader: 'lazy__preloader',
    lazyImage: 'lazy__image',
    lazyLoaded: 'is-loaded',
    fixed: 'is-fixed',
    focused: 'is-focused',
    filled: 'is-filled',
    invalid: 'is-invalid',
    error: 'is-error',
    selected: 'is-selected'
  },
  formValidationMessages: {
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
  },
	get windowWidth() {
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
	},
	get windowHeight() {
		return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
	},
	scrollbarWidth:	window.innerWidth - document.documentElement.clientWidth,
	breakpoints: {
    m: 375,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
	},
  dom: {
    header: document.getElementById('js-header'),
    wrapper: document.getElementById('js-page-wrapper'),
    footer: document.getElementById('js-footer'),
  },
  messages: {
	  lazyError: 'Ошибка загрузки изображения'
  }
};

export default variables;

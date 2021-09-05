const variables = {
	$EXTERNAL_API_NAME: '$HELPERS',
	gsapDefaultDuration: .25,
  carouselDefaultDuration: 800,
	resizeDebounce: 100,
	debugLogs: true,
	debugLogsDisabledNotify: true,
	customEventNames: {
		resize: 'resize-done'
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
    error: 'is-error'
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

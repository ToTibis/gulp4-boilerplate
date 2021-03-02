const variables = {
	$EXTERNAL_API_NAME: '$API',
	gsapDefaultDuration: .25,
	resizeDebounce: 100,
	debugLogs: true,
	debugLogsDisabledNotify: true,
	customEventNames: {
		resize: 'resize-done',
		animateEnd: 'animate-end',
		modal: {
			open: 'modal-open',
			opened: 'modal-opened',
			close: 'modal-close',
			closed: 'modal-close-end'
		}
	},
	get windowWidth() {
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
	},
	get windowHeight() {
		return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
	},
	scrollbarWidth:	window.innerWidth - document.documentElement.clientWidth,
	breakpoints: {
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
	}
};

export default variables;

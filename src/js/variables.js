import $assist from "./utilities/Assistant";

export const variables = {
	assistantDebugMode: true,
	body: $assist('body'),
	gsapDefaultDuration: .25,
	customResizeEventName: 'global-resize-done',
	breakpoints: {
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
	}
};

document.addEventListener("DOMContentLoaded", function(event) { 

	MicroModal.init({
		onShow: modal => console.info(`${modal.id} is shown`),
		onClose: modal => console.info(`${modal.id} is hidden`),
		openTrigger: 'data-modal-open',
		closeTrigger: 'data-modal-close',
		disableScroll: true,
		disableFocus: false,
		awaitCloseAnimation: true,
		debugMode: true
	});

});
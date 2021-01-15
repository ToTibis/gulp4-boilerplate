export const $data = (function () {

	const localAPIs = {};

	localAPIs.deepAssign = function () {
		let len = arguments.length;
		if (len < 1) return;
		if (len < 2) return arguments[0];

		for (let i = 1; i < len; i++) {
			for (let key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					if (Object.prototype.toString.call(arguments[i][key]) === '[object Object]') {
						arguments[0][key] = localAPIs.deepAssign(arguments[0][key] || {}, arguments[i][key]);
					} else {
						arguments[0][key] = arguments[i][key];
					}
				}
			}
		}

		return arguments[0];
	};

	return localAPIs;

})();

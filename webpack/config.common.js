module.exports = {
	output: {
		filename: 'bundle.min.js',
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				loader: 'babel-loader'
			}
		]
	},
};
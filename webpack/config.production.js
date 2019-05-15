const
		common = require('./config.common'),
		merge = require('webpack-merge'),
		uglifyJs = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'none'
});

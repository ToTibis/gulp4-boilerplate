const
		common = require('./config.common'),
  { merge } = require('webpack-merge');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map'
});

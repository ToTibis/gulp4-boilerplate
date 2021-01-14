const path                      = require('path');
const TerserPlugin              = require('terser-webpack-plugin');
const HardSourceWebpackPlugin   = require('hard-source-webpack-plugin');

module.exports = {
	entry: {
		main: './src/js/main.js',
		iePolyfills: './src/js/iePolyfills'
	},
	output: {
		filename: '[name].js',
		chunkFilename: '[name].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				use: [
					{
						loader: 'cache-loader',
						options: {
							cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/cache-loader'),
						},
					},
					'babel-loader'
				]
			},
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendors',
					enforce: true
				}
			}
		},
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true
			})
		]
	},
	plugins: [
		new HardSourceWebpackPlugin()
	]
};
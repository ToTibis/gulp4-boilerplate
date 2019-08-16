const path                      = require('path');
const webpack                   = require('webpack');
const TerserPlugin              = require('terser-webpack-plugin');
const UglifyJs                  = require('uglifyjs-webpack-plugin');
const HardSourceWebpackPlugin   = require('hard-source-webpack-plugin');

module.exports = {
	entry: {
		main: './src/js/main.js'
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
			}),
			new UglifyJs({
				cache: true,
				parallel: true,
				uglifyOptions: {
					compress: false,
					ecma: 6,
					output: {
						comments: false
					}
				},
			})
		]
	},
	plugins: [
		new HardSourceWebpackPlugin(),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		})
	]
};
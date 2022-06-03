import {isProduction} from '../index';

const path                      = require('path');
const TerserPlugin              = require('terser-webpack-plugin');

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
							cacheDirectory: path.resolve(__dirname, '../../../node_modules/.cache/cache-loader'),
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
				defaultVendors: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendors',
					enforce: true
				}
			}
		},
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          }
        },
      }),
    ],
	}
};
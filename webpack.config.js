const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ZipEntriesPlugin = require('./src/plugins/zip-entries-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		'deploy-api-docs': '@/lambdas/deploy-api-docs.js',
		'users-delete': '@/lambdas/users-delete.js',
		'users-create': '@/lambdas/users-create.js',
		'users-get': '@/lambdas/users-get.js',
		'users-list': '@/lambdas/users-list.js',
		'users-update': '@/lambdas/users-update.js'
	},
	output: {
		filename: 'functions/[name].js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd'
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},
	optimization: {
		minimize: process.env.NODE_ENV === 'production',
		minimizer: [new TerserPlugin({
			terserOptions: {
				output: {
					comments: /@license/i,
				},
			},
			extractComments: false
		})],
	},
	target: 'node',
	externals: {
		'aws-sdk': 'aws-sdk'
	},
	plugins: [
		new ZipEntriesPlugin()
	]
};
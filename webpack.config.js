const path = require('path');

module.exports = {
	entry: './index.js',
	module: {
		rules: [
			{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/,
				options: {
					plugins: ['transform-class-properties']
				}
			}
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'nestup.bundle.js',
		libraryTarget: "umd",
		library: "Nestup"
	}
};

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  entry: {
    'app': './src/main.ts',
    'polyfills': [
      'core-js/es6',
      'core-js/es7/reflect',
      'zone.js/dist/zone'
    ]
  },
  output: {
    path: './target',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {test: /\.component.ts$/, loader: 'ts!angular2-template'},
      {test: /\.ts$/, exclude: /\.component.ts$/, loader: 'ts'},
      {test: /\.html$/, loader: 'raw'},
      {test: /\.css$/, include: path.resolve('src/resources/vendor'), loader: 'raw'},
      {test: /\.css$/, include: path.resolve('src/resources/vendor'), loader: ExtractTextPlugin.extract('style', 'css')},
	  {test: /\.css$/, include: path.resolve('node_modules'), loader: ExtractTextPlugin.extract('style', 'css')},
      {test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=fonts/[name].[ext]'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.html', '.css']
  },
  devServer: {
    proxy: {
      "**": "http://localhost:7080"
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      app: {
        environment: JSON.stringify(process.env.APP_ENVIRONMENT || 'development')
      }
    }),
    new ExtractTextPlugin('[name].css'),
	new webpack.ProvidePlugin({
		$: 'jquery',
		jquery: 'jquery',
		jQuery: 'jquery'
    })
  ]
};

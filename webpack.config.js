const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry:  {
      bikeappvue: __dirname + "/app/javascript/bikeappvue.js",
      vue: __dirname + "/app/javascript/vue.js",
    },

    output: {
      //path: __dirname + "/public",
      path: __dirname + "/build",
      filename: "[name].js"
    },
  //},
  module: {
    rules: [
      {
       test: /\.css$/,
       loader: [ 'style-loader', 'css-loader' ]
      }
    ],
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/register.html', to: "register.html" },
      { from: './app/contact.html', to: "contact.html" },
      { from: './app/proveit.html', to: "proveit.html" },
      { from: './app/chainlink.png', to: "chainlink.png" },
      { from: './app/poofileexample.jpg', to: "poofileexample.jpg" },
      { from: './app/bikedeedlogo.png', to: "bikedeedlogo.png" },
      { from: './app/QR_icon.svg', to: "QR_icon.svg" },
      { from: './app/modal.css', to: "modal.css" },
      { from: './app/qrcode.css', to: "qrcode.css" }
    ])
  ],
}

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
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
      { from: './app/proofofownership.png', to: "proofofownership.png" },
      { from: './app/chainlink.png', to: "chainlink.png" },
      { from: './app/poofileinfo.png', to: "poofileinfo.png" },
      { from: './app/poofileexample.jpg', to: "poofileexample.jpg" },
      { from: './app/modal.css', to: "modal.css" }
    ])
  ],
}

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry:  {
      bikeapp: __dirname + "/app/javascript/bikeapp.js",
      register: __dirname + "/app/javascript/register.js"
    },

    output: {
      //path: __dirname + "/public",
      path: __dirname + "/build",
      filename: "[name].js"
    },
  //},
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/register.html', to: "register.html" },
      { from: './app/report.html', to: "report.html" },
      { from: './app/contact.html', to: "contact.html" },
      { from: './app/chainlink.png', to: "chainlink.png" }
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
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
  }
}

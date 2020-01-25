const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const config = require("./webpack.base.js");
const dotenv = require('dotenv-webpack');

const envBasePath = path.resolve(__dirname, "../environments");

module.exports = merge(config, {
  optimization: {
    splitChunks: {}
  },
  mode: "production",
  output: {
    filename: "tree-trimmer.bundle.js",
    path: path.resolve(__dirname, "../dist")
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': 'production'
      }
    }),
    new dotenv({
      path: `${envBasePath}/.env`,
      systemvars: true
    })
  ]
});

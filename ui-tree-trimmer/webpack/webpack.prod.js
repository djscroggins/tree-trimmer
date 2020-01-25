const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const config = require("./webpack.base.js");

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
    })]
});

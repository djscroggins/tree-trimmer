const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const config = require("./webpack.config.js");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(config, {
  mode: "production",
  output: {
    filename: "tree-trimmer.bundle.js",
    path: path.resolve(__dirname, "../dist")
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": "production"
      }
    }),
    new BundleAnalyzerPlugin()]
});

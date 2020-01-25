const merge = require("webpack-merge");
const path = require("path");
const config = require("./webpack.base.js");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const dotenv = require('dotenv-webpack');

module.exports = merge(config,  {
  mode: "production",
  output: {
    filename: "tree-trimmer.bundle.js",
    path: path.resolve(__dirname, "../dist")
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new dotenv({
      path: `${envBasePath}/.env`,
      systemvars: true
    })
  ]
});

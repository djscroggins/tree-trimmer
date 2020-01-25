const merge = require("webpack-merge");
const path = require("path");
const config = require("./webpack.config.js");

module.exports = merge(config, {
  mode: "production",
  output: {
    filename: "tree-trimmer.bundle.js",
    path: path.resolve(__dirname, "dist")
  }
});

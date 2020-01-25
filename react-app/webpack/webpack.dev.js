const WebpackBar = require("webpackbar");
const merge = require("webpack-merge");
const config = require("./webpack.base.js");
const dotenv = require('dotenv-webpack');
const path = require("path");

const envBasePath = path.resolve(__dirname, "../environments");


module.exports = merge(config, {
  mode: "development",
  plugins: [
    new WebpackBar(),
    new dotenv({
      path: `${envBasePath}/.env.local`,
      systemvars: true
    })
  ]
});

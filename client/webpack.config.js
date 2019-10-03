const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  target: "web",
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    contentBase: "./dist",
    overlay: true,
    publicPath: "/",
    hot: true,
    historyApiFallback: true,
    port: 9000
  },
  plugins: [
    new CopyWebpackPlugin(["index.html"]),
    new webpack.HotModuleReplacementPlugin()
  ]
};

"use strict";

const path = require("path");

const pathToBuildRoot = path.resolve('..', '..', 'built', 'backend')

module.exports = {

  // The application entry point
  entry: path.resolve('entry.ts'),

  // Set debugging source maps to be "inline" for
  // simplicity and ease of use
  //devtool: "inline-source-map",

  mode: 'development',

  // Where to compile the bundle
  // By default the output directory is `dist`
  output: {
    filename: 'entry.js',
    path: path.resolve(pathToBuildRoot)
  },

  stats: {
    warnings: false
  },
  
  target: 'node',

  // Supported file loaders
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ]
  },

  // File extensions to support resolving
  resolve: {
    extensions: [".ts", ".js"]
  }
};
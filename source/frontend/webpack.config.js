"use strict";

const path = require("path");
const CopyPlugin = require('copy-webpack-plugin')

const pathToBuildRoot = path.resolve('..', '..', 'built', 'frontend')

module.exports = {

  // The application entry point
  entry: path.resolve('entry.tsx'),

  // Set debugging source maps to be "inline" for
  // simplicity and ease of use
  //devtool: "inline-source-map",
  devtool: "inline-source-map",

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

  plugins: [
    
    // Copy files.
    new CopyPlugin({
      patterns: [
        { from: path.resolve('index.html'), to: path.resolve(pathToBuildRoot, 'index.html') },
        { from: path.resolve('alarm.wav'), to: path.resolve(pathToBuildRoot, 'alarm.wav') }
      ]
    })
  ],

  // Supported file loaders
  module: {
    rules: [
      {
        //test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ]
  },

  // File extensions to support resolving
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
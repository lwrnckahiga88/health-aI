const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // Import webpack

module.exports = {
  entry: './client/index.mjs', // This is the entry point for your app
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the output directory before emit
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: { fullySpecified: false }, // Allow incomplete import paths
      },
      {
        test: /\.css$/, // Process CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/, // Process image files
        type: 'asset/resource',
      },
      {
        test: /\.onnx$/, // Add rule for ONNX files
        type: 'asset/resource', // Treat ONNX as a static asset
        generator: {
          filename: 'models/[name][ext][query]', // Output path for the model file
        },
      },
      {
        test: /\.wasm$/, // Handle WASM files
        type: 'asset/resource', // Treat WASM as a static asset
        generator: {
          filename: 'wasm/[name][ext][query]', // Output path for the WASM file
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html', // Your HTML file
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^async_hooks$/, // Ignore async_hooks module
    }),
    new webpack.ContextReplacementPlugin(
      /express[\\\/]lib/,
      false, // Ignore dynamic requires in Express
    ),
  ],
  mode: 'development', // Set the mode here

  devServer: {
    static: path.join(__dirname, 'dist'), // Updated option
    compress: true,
    port: 9000,
  },
  resolve: {
    fallback: {
      "os": require.resolve("os-browserify/browser"), // Polyfill for os
      "vm": require.resolve("vm-browserify"), // Polyfill for vm
      "child_process": false, // Exclude child_process in the browser
      "fs": false, // Exclude fs in the browser
      "http": require.resolve("stream-http"), // Polyfill for http
      "https": require.resolve("https-browserify"), // Polyfill for https
      "net": false, // Exclude net in the browser
      "tls": false, // Exclude tls in the browser
      "path": require.resolve("path-browserify"), // Polyfill for path
      "buffer": require.resolve("buffer/"), // Polyfill for buffer
      "stream": require.resolve("stream-browserify"), // Polyfill for stream
      "crypto": require.resolve("crypto-browserify"), // Polyfill for crypto
      "url": require.resolve("url/"), // Polyfill for url
      "assert": require.resolve("assert/"), // Polyfill for assert
      "zlib": require.resolve("browserify-zlib"), // Polyfill for zlib
      "querystring": require.resolve("querystring-es3"), // Polyfill for querystring
    }
  },
};

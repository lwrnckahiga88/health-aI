const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Clears old files in dist/
    publicPath: '/', // Ensures assets are loaded correctly, especially in sub-paths
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'models', to: 'models' }],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new NodePolyfillPlugin(), // ✅ Fixes missing Node.js modules
    new webpack.HotModuleReplacementPlugin(), // 🔥 Enables HMR
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      fs: false, // Prevents errors for `fs` (not needed in browser)
    },
  },
  devServer: {
    static: path.resolve('dist'),
    open: true,
    hot: true, // 🔥 Enables HMR
    historyApiFallback: true, // Prevents "Cannot GET /route" errors in React Router
    port: 3000, // Change the port if needed
    compress: true, // Enables compression for better performance in dev
  },
};





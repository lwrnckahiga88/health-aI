const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.js',
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[contenthash].js',
    publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer'),
      os: require.resolve('os-browserify/browser'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      events: require.resolve('events/'),
      zlib: require.resolve('browserify-zlib'),
      constants: require.resolve('constants-browserify'),
      querystring: require.resolve('querystring-es3'),
      process: require.resolve('process/browser'),

      // Node.js-only modules disabled
      fs: false,
      'fs/promises': false,
      'node:fs/promises': false,
      module: false,
      net: false,
      tls: false,
      worker_threads: false,
      tty: false,
      inspector: false,
      pnpapi: false,
      async_hooks: false,
      child_process: false,

      // Core-js-compat-related
      'core-js-compat/data': false,
      'core-js-compat/entries': false,
      'core-js-compat/modules': false,
      'core-js-compat/modules-by-versions': false,
      './modules': false,
      './modules-by-versions': false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3,
                exclude: ['transform-typeof-symbol']
              }],
              '@babel/preset-react'
            ],
            plugins: [
              isDevelopment && 'react-refresh/babel',
              '@babel/plugin-transform-runtime'
            ].filter(Boolean)
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: isDevelopment
                  ? '[path][name]__[local]--[hash:base64:5]'
                  : '[hash:base64:5]'
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|glb|gltf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.node$/,
        use: 'ignore-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      minify: !isDevelopment ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      } : false
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new NodePolyfillPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /(worker_threads|inspector|@swc\/wasm|webpack-plugin-serve|async_hooks|child_process|core-js-compat(\/.*)?|\.\/modules(-by-versions)?)/,
      contextRegExp: /(jest-worker|@swc\/core|@pmmmwh\/react-refresh-webpack-plugin|@rollup\/plugin-terser|babel-plugin-polyfill-corejs3|workbox-build)/
    }),
    new WebpackPwaManifest({
      name: 'Health-AI',
      short_name: 'HEALTH',
      description: 'TELEHEALTH',
      background_color: '#ffffff',
      theme_color: '#4f46e5',
      crossorigin: 'use-credentials',
      inject: true,
      fingerprints: false,
      ios: true,
      icons: [
        {
          src: path.resolve('public/assets/icons/kastone1.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('assets', 'icons')
        }
      ]
    }),
    !isDevelopment && new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      exclude: [/\.map$/, /manifest$/, /\.htaccess$/],
      swDest: 'sw.js',
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|glb|gltf)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources'
          }
        },
        {
          urlPattern: new RegExp('^https://api.yourdomain.com/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60
            }
          }
        }
      ]
    }),
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 3001,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true
    },
    devMiddleware: {
      writeToDisk: true
    }
  },
  optimization: {
    minimize: !isDevelopment,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        three: {
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          name: 'three',
          chunks: 'all',
          priority: 10
        }
      }
    },
    runtimeChunk: 'single'
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  externals: {
    '@swc/core': 'commonjs @swc/core',
    esbuild: 'commonjs esbuild',
    '@rollup/plugin-terser': 'commonjs @rollup/plugin-terser'
  }
};

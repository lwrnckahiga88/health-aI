const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const webpack = require('webpack');
// Removed TerserPlugin import - using webpack's default minimizer

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.js',
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[contenthash].js',
    publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "querystring": require.resolve("querystring-es3"),
      "module": false,
      "fs": false,
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "vm": require.resolve("vm-browserify"),
      "process": require.resolve("process/browser"),
      "fs": false,
      "worker_threads": false,
      "child_process": false
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
                corejs: 3 
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
          // Removed postcss-loader since it's not installed
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|glb|gltf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
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
    new WebpackPwaManifest({
      name: '3D Shoe Customizer',
      short_name: 'ShoeCustomizer',
      description: 'Customize 3D shoes in your browser',
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
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
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
        new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
        }),
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
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^worker_threads$/,
      contextRegExp: /jest-worker/
    }),
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true
    },
    devMiddleware: {
      writeToDisk: true
    }
  },
  optimization: {
    minimize: !isDevelopment,
    // Removed custom minimizer - webpack 5 uses TerserPlugin by default
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
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const webpack = require('webpack');
// Removed TerserPlugin import - using webpack's default minimizer

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.js',
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[contenthash].js',
    publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "querystring": require.resolve("querystring-es3"),
      "module": false,
      "fs": false,
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "vm": require.resolve("vm-browserify"),
      "process": require.resolve("process/browser"),
      "fs": false,
      "worker_threads": false,
      "child_process": false
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
                corejs: 3 
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
          // Removed postcss-loader since it's not installed
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|glb|gltf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
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
    new WebpackPwaManifest({
      name: '3D Shoe Customizer',
      short_name: 'ShoeCustomizer',
      description: 'Customize 3D shoes in your browser',
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
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
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
        new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
        }),
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
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^worker_threads$/,
      contextRegExp: /jest-worker/
    }),
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true
    },
    devMiddleware: {
      writeToDisk: true
    }
  },
  optimization: {
    minimize: !isDevelopment,
    // Removed custom minimizer - webpack 5 uses TerserPlugin by default
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
  }
};


      }
};


    

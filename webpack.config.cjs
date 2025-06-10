const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  target: 'web',
  mode: isDevelopment ? 'development' : 'production',
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: !isDevelopment,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    fallback: {
      fs: false,
      net: false,
      tls: false,
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      querystring: require.resolve('querystring-es3'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url/'),
      vm: require.resolve('vm-browserify'),
      buffer: require.resolve('buffer/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(onnxruntime-web|@xenova\/transformers))/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: '> 0.25%, not dead',
                shippedProposals: true
              }],
              '@babel/preset-react'
            ],
            plugins: [
              isDevelopment && require.resolve('react-refresh/babel'),
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-private-methods',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              ['@babel/plugin-transform-runtime', { regenerator: true }]
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
              modules: {
                auto: true,
                localIdentName: isDevelopment 
                  ? '[path][name]__[local]'
                  : '[hash:base64:8]'
              }
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
      {
        directory: path.join(__dirname, 'models'),
        publicPath: '/models',
      }
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  externals: {
    express: 'commonjs express',
  },
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : 'hidden-source-map'
};
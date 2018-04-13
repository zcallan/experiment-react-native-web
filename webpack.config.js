const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'web/index.js'),
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/react-native-uncompiled')
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      babelrc: false,
      // Babel configuration (or use .babelrc)
      // This aliases 'react-native' to 'react-native-web' and includes only
      // the modules needed by the app.
      plugins: [
        'react-native-web',
        'transform-async-to-generator',
        ['transform-runtime', {
          polyfill: false,
          regenerator: true,
        }],
        // ['react-css-modules', {
        //   context: path.resolve(__dirname, 'src'),
        //   generateScopedName: '[path][local]_[hash:base64:4]',
        //   exclude: 'node_modules',
        // }],
      ],
      // The 'react-native' preset is recommended to match React Native's packager
      presets: [
        'react-native',
        'react',
      ]
    }
  }
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]'
    }
  }
};

const cssLoaderConfiguration = {
  test: /\.css$/,
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: 1,
        localIdentName: '[path][local]_[hash:base64:4]',
      },
    },
  ],
};

const sassLoaderConfiguration = {
  test: /\.scss$/,
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: '[path][local]_[hash:base64:4]',
      },
    },
    {
      loader: 'sass-loader',
    },
  ],
};

module.exports = {
  context: path.resolve(__dirname, 'src'),

  // your web-specific entry file
  entry: path.resolve(__dirname, 'web/index.js'),

  // configures where the build ends up
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  // ...the rest of your config

  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      cssLoaderConfiguration,
      sassLoaderConfiguration,
    ],
  },

  plugins: [
    // `process.env.NODE_ENV === 'production'` must be `true` for production
    // builds to eliminate development checks and reduce build size. You may
    // wish to include additional optimizations.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: process.env.NODE_ENV !== 'production' || true,
    }),
    new HtmlWebpackPlugin({
      template: '../web/index.html',
    }),
    new webpack.NamedModulesPlugin(),
  ],

  resolve: {
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: [ '.web.js', '.js' ],
  },

  devtool: 'inline-source-map',

  devServer: {
    port: process.env.PORT || 3000,
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
  }
}

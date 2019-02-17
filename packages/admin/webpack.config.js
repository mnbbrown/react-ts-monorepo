const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const REACT_APP = /^REACT_APP_/i;

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = process.env.NODE_ENV !== 'production'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const publicPath = process.env.PUBLIC_PATH || "/"
const shouldUseRelativeAssetPaths = publicPath === './';
const publicUrl = isEnvProduction ? publicPath.slice(0, -1) : isEnvDevelopment && '';

const rawEnv = Object.keys(process.env).filter(key => REACT_APP.test(key)).reduce((env, key) => {
  return { ...env, [key]: process.env[key] }
}, {
  NODE_ENV: process.env.NODE_ENV || 'development',
	PUBLIC_URL: publicUrl
});

const stringifiedEnv = Object.keys(process.env).reduce((env, key) => {
	return { ...env, [key]: process.env[key] };
}, {});

const babelLoaderConfig = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    presets: [
      ["@babel/preset-env", { modules: false }],
      ["@babel/preset-react", { development: isEnvDevelopment, useBuiltIns: true, }]
    ],
    plugins: [
      '@babel/plugin-transform-destructuring',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }]
    ]
  }
}


module.exports = {
  module: {
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          babelLoaderConfig,
          { loader: 'thread-loader', options: { workers: require('os').cpus().length - 1, poolTimeout: Infinity } },
          { loader: 'ts-loader', options: { happyPackMode: true } }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [babelLoaderConfig]
      },
      {
        loader: require.resolve('file-loader'),
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      }
    ]
  },

  plugins: [
    !isEnvProduction && new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new HtmlWebpackPlugin(
      Object.assign({}, {
        template: './public/index.html',
        inject: true,
      }, isEnvProduction ? {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      } : {})
    ),
    isEnvProduction && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, rawEnv),
		new webpack.DefinePlugin(stringifiedEnv)
  ].filter(Boolean),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    plugins: [new TsconfigPathsPlugin({configFile: "./tsconfig.json"})]
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [new TerserPlugin({
      terserOptions: {
        parse: {
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true
        },
      },
      parallel: true,
      cache: true,
      sourceMap: shouldUseSourceMap,
    })]
  },
  entry: [
    isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
    './src/index.tsx',
  ].filter(Boolean),
  output: {
    path: isEnvProduction ? path.resolve(__dirname, './build') : undefined,
    pathinfo: isEnvDevelopment,
    filename: isEnvProduction
      ? 'static/js/[name].[chunkhash:8].js'
      : isEnvDevelopment && 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
    chunkFilename: isEnvProduction
      ? 'static/js/[name].[chunkhash:8].chunk.js'
      : isEnvDevelopment && 'static/js/[name].chunk.js',
    publicPath: '/',
  },
  mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
  bail: isEnvProduction,
  devtool: isEnvProduction
    ? shouldUseSourceMap
      ? 'source-map'
      : false
  : isEnvDevelopment && 'eval-source-map',
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: false
};

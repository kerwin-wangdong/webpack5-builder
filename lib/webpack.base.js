const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const projectRoot = process.cwd();
const devMode = process.env.NODE_ENV !== 'production';
const themeVariables = require(path.join(projectRoot, './src/client/theme.js'));

module.exports = {
  target: devMode ? 'web' : 'browserslist',
  stats: 'errors-warnings',
  entry: {
    index: path.join(projectRoot, './src/client/index.jsx'),
  },
  output: {
    clean: true,
    publicPath: '/',
    path: path.join(projectRoot, './dist'),
    filename: devMode ? '[name].js' : '[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: '3.15.2',
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                [
                  'import',
                  {
                    libraryName: 'antd',
                    style: true,
                  },
                ],
                // Applies the react-refresh Babel plugin on non-production modes only
                devMode && 'react-refresh/babel',
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.(c|le)ss$/i,
        exclude: /\.module\.(c|le)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: themeVariables,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(c|le)ss$/i,
        include: /\.module\.(c|le)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: themeVariables,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|tif|webp|svg|avif)$/i,
        type: 'asset',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: path.join(projectRoot, './public/favicon.ico'),
      template: path.join(projectRoot, './public/index.html'),
      inject: true,
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new AntdDayjsWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.less'],
    alias: {
      '@': path.join(projectRoot, './src/client'),
    },
  },
};

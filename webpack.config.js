const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/renderer.js',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'app'),
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(svg|jpg|png)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  externals: [
    function(context, request, callback) {
      if (
        /^path|fs|events|electron|drivelist|excel4node|usb-detection|pigpio|@abandonware\/noble|crypto|bindings$/.test(
          request
        )
      ) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ],
  mode,
};

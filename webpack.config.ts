const VueLoaderPlugin = require('vue-loader/lib/plugin');
import * as Webpack from 'webpack';

const production = process.env.NODE_ENV === 'production';

const config: Webpack.Configuration = {
  mode: production ? 'production' : 'development',
  entry: './src/client/index.ts',
  output: {
    filename: 'app.js',
    path: __dirname + '/build/client',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.html$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
  },
};

export default config;

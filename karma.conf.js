const webpack = require('webpack');
const conCobertura = process.argv.includes('--coverage');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [{ pattern: 'test-entry.js', watched: false }],
    preprocessors: { 'test-entry.js': ['webpack'] },

    webpack: {
      mode: 'development',
      devtool: false,
      plugins: [
        new webpack.DefinePlugin({
          'process.env.REACT_APP_API_URL': JSON.stringify('http://localhost:8080/api'),
        }),
      ],
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: conCobertura ? [['istanbul', { exclude: ['**/*.spec.js', 'test-entry.js'] }]] : [],
              },
            },
          },
        ],
      },
    },

    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] },
    },

    reporters: conCobertura ? ['progress', 'coverage'] : ['progress'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'text' }],
    },

    singleRun: true,
  });
};

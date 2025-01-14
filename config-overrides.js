const webpack = require('webpack');
const WorkBoxPlugin = require('workbox-webpack-plugin');

module.exports = function override(config) {
  // Polyfills for Node.js core modules in the browser
  config.resolve.fallback = {
    process: require.resolve('process/browser'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    buffer: require.resolve('buffer'),
    assert: require.resolve('assert'),
  };

  // Ignore source map warnings for specific modules
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    exclude: /node_modules\/stylis-plugin-rtl/,
    use: ['source-map-loader'],
  });

  // Modify Workbox Plugin to increase the maximum file size for caching
  config.plugins.forEach((plugin) => {
    if (plugin instanceof WorkBoxPlugin.InjectManifest) {
      plugin.config.maximumFileSizeToCacheInBytes = 50 * 1024 * 1024; // 50MB
    }
  });

  // Provide global variables for process and Buffer
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};

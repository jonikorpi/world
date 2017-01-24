const webpack = require("webpack");

module.exports = {
  webpack: (config, { dev }) => {
    config.resolve.modules.push("node_modules/tone");

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.GAME_VERSION': JSON.stringify(process.env.GAME_VERSION),
      })
    );

    return config;
  }
}

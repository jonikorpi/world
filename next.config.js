module.exports = {
  webpack: (config, { dev }) => {
    config.resolve.modules.push("node_modules/Tone");
    return config;
  }
}

const config = require('./webpack.config')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const webpack = require('webpack');

const parseStats = (output) => {
  const { stats } = output;
  const time = stats.startTime - stats.endTime;
  return `Took ${time}ms`;
}

module.exports = () => {
  const compiler = webpack([config(true)]);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
      );
      return resolve(messages);
    });
  });
}
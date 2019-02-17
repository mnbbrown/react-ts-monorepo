const config = require('./webpack.config');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {
  choosePort,
  createCompiler,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

module.exports = () => choosePort(HOST, DEFAULT_PORT)
  .then((port) => {
    if (port === null) {
      return;
    }
    const urls = prepareUrls("http", HOST, port);
    const compiler = createCompiler(webpack, config(false), "", urls, true);
    const devServer = new WebpackDevServer(compiler, {
      open: true
    });

    return new Promise((resolve, reject) => {
      devServer.listen(port, HOST, err => {
        if (err) {
          return reject(err);
        }
      });
  
      ['SIGINT', 'SIGTERM'].forEach(function(sig) {
        process.on(sig, function() {
          devServer.close();
          resolve();
        });
      });
    })
  })
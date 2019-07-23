const chokidar = require('chokidar')
const fs = require('fs-extra')
const globby = require('globby')
const EventEmitter = require('events')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const logger = require('../utils/logger')

async function resolvePort(port) {
  const portfinder = require('portfinder')
  portfinder.basePort = parseInt(port) || 8080
  port = await portfinder.getPortPromise()
  return port
}

function dirname(filePath) {
  return path.basename(path.dirname(filePath))
}

module.exports = class RunProcess extends EventEmitter {
  constructor(ctx) {
    super()
    this.context = ctx
  }

  async process() {
    this.prepareWebpackConfig()
    await Promise.all([
      this.watchSourceFile(),
      this.watchConfig(),
      this.watchAssets(),
      this.resolveHost(),
      this.resolvePort()
    ])
  }

  async resolvePort() {
    this.port = await resolvePort()
  }

  resolveHost() {
    this.host = 'localhost'
  }

  prepareWebpackConfig() {
    this.webpackConfig = require('../webpack/webpack.config.js')
  }

  async watchSourceFile() {
    const { filePath, dirPath } = this.context
    const watcher = chokidar.watch(filePath, {
      cwd: dirPath,
      ignoreInitial: true
    })

    watcher.on('add', target => this.handleUpate('add', target))
    watcher.on('unlink', target => this.handleUpate('unlink', target))
    watcher.on('change', target => this.handleUpate('change', target))
  }

  async watchConfig() {
    const { configPath, dirPath } = this.context
    const watcher = chokidar.watch(configPath, {
      cwd: dirPath,
      ignoreInitial: true
    })

    watcher.on('add', target => this.handleUpate('add', target))
    watcher.on('unlink', target => this.handleUpate('unlink', target))
    watcher.on('change', target => this.handleUpate('change', target))
  }

  async watchAssets() {
    const { dirPath, filename } = this.context
    const watcher = chokidar.watch(
      ['assets/**', '!.DS_Store', '!node_modules'],
      {
        cwd: dirPath,
        ignoreInitial: true
      }
    )

    watcher.on('unlink', target => this.handleUpate('unlink', target))
    watcher.on('change', target => this.handleUpate('change', target))
    watcher.on('add', target => this.handleUpate('add', target))
  }

  async handleUpate(type, target) {
    this.emit('fileChanged', {
      type,
      target
    })
  }

  createServer() {
    const contentBase = this.context.tempPath
    const serverConfig = {
      disableHostCheck: true,
      hot: true,
      clientLogLevel: 'error',
      quiet: true,
      headers: {
        'access-control-allow-origin': '*'
      },
      overlay: false,
      host: this.host,
      open: true,
      contentBase,
      historyApiFallback: true,
      watchOptions: {
        igonred: [/node_modules/, `!${this.context.tempPath}/**`]
      }
    }

    WebpackDevServer.addDevServerEntrypoints(this.webpackConfig, serverConfig)

    const compiler = webpack(this.webpackConfig)
    this.server = new WebpackDevServer(compiler, serverConfig)
    return this
  }

  listen() {
    this.server.listen(this.port, this.host, err => {
      if (err) {
        throw new Error(err)
      } else {
        logger.success(
          '服务启动成功,请访问:',
          chalk.blue(`${this.host}:${this.port}`)
        )
      }
    })

    return this
  }
}

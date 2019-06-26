const chokidar = require('chokidar')
const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')
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

module.exports = class RunProcess {
  constructor(ctx) {
    this.context = ctx
  }

  async process() {
    this.watchFile()
    await this.resolvePort()
    await this.resolveHost()
    this.prepareWebpackConfig()
    await this.copyFile()
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

  async copyFile() {
    const { tempPath, filePath } = this.context
    const dest = path.resolve(tempPath, 'ppt.md')
    await fs.copy(filePath, dest)
  
    const dirPath = path.dirname(filePath)
    const filename = path.parse(filePath).name

    const asserts = await globby(['**/*', `!${filename}.md`, '!node_modules'], { cwd: dirPath })
    await Promise.all(asserts.map(async (name) => {
      const from = path.resolve(dirPath, name)
      const to = path.join(tempPath, name)
      await fs.copy(from, to)
    }))
  }

  watchFile() {
    const { filePath } = this.context
    const watcher = chokidar.watch(filePath)

    watcher.on('unlink', target => this.handleUpate('unlink', target))
    watcher.on('change', target => this.handleUpate('change', target))
  }

  async handleUpate(type, target) {
    if (type === 'unlink') {
      console.log('文件被删除')
      process.exit(-1)
    } else if (type === 'change') {
      logger.tip(`reload due to ${target}`)
      const { tempPath } = this.context
      const dest = path.join(tempPath, 'ppt.md')
      await fs.copy(target, dest)
    }
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
        igonred: [
          /node_modules/,
          `!${this.context.tempPath}/**`
        ]
      }
    }

    WebpackDevServer.addDevServerEntrypoints(this.webpackConfig, serverConfig)

    const compiler = webpack(this.webpackConfig)
    this.server = new WebpackDevServer(compiler, serverConfig)
    return this
  }

  listen() {
    this.server.listen(this.port, this.host, (err) => {
      if (err) { throw new Error(err) } else {logger.success('运行成功,请访问:', `${this.host}:${this.port}`)
      }
    })
    return this
  }
}
const chokidar = require('chokidar')
const fs = require('fs-extra')
const globby = require('globby')
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

module.exports = class RunProcess {
  constructor(ctx) {
    this.context = ctx
  }

  async process() {
    this.prepareWebpackConfig()
    await Promise.all([
      this.watchFile(),
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

  // async copyFile() {
  //   const { tempPath, filePath } = this.context
  //   const dest = path.resolve(tempPath, 'ppt.md')
  //   await fs.copy(filePath, dest)
  
  //   const dirPath = path.dirname(filePath)
  //   const filename = path.parse(filePath).name

  //   const assets = await globby(['**/*', `!${filename}.md`, '!node_modules'], { cwd: dirPath })
  //   await Promise.all(assets.map(async (name) => {
  //     const from = path.resolve(dirPath, name)
  //     const to = path.join(tempPath, name)
  //     await fs.copy(from, to)
  //   }))
  // }

  async watchFile() {
    const { filePath } = this.context
    const watcher = chokidar.watch(filePath)

    watcher.on('add', async target => await this.handleUpate('add', target, 'source'))
    watcher.on('unlink', async target => await this.handleUpate('unlink', target, 'source'))
    watcher.on('change', async target => await this.handleUpate('change', target, 'source'))
  }

  async watchAssets() {
    const { dirPath, filename } = this.context
    const watcher = chokidar.watch(['**/*', `!${filename}.md`, '!.DS_Store', '!node_modules'], { cwd: dirPath })

    watcher.on('unlink', async target => await this.handleUpate('unlink', target, 'assets'))
    watcher.on('add', async target => await this.handleUpate('add', target, 'assets'))
  }

  async handleUpate(type, target, from) {
    const { tempPath, dirPath, filePath } = this.context
 
    if (type === 'unlink') {
      if (from === 'source') {
        logger.error('源文件被删除', chalk.red(target))
        process.exit(-1)
      } else if (from === 'assets') {
        logger.debug(`静态文件被删除: ${chalk.red(target)}`)
        const dest = path.join(tempPath, target)
        logger.debug('dest path', dest)
        await fs.remove(dest)
      }
    } else if (type === 'change') {
      if (from === 'source') {
        logger.tip(`源文件变动: ${chalk.cyan(target)}`)
        const dest = path.join(tempPath, 'ppt.md')
        logger.debug('dest path', dest)
        await fs.remove(dest)
        await fs.copy(filePath, dest)
      }
    } else if (type === 'add') {
      if (from === 'assets') {
        logger.debug(`静态文件被添加: ${chalk.cyan(target)}`)
        const src = path.join(dirPath, target)
        const dest = path.join(tempPath, target)
        logger.debug('dest path', dest)
        await fs.copy(src, dest)
      } else if (from === 'source') {
        logger.debug(`源文件被添加: ${chalk.cyan(target)}`)
        const dest = path.join(tempPath, 'ppt.md')
        logger.debug('dest path', dest)
        await fs.copy(filePath, dest)
      }
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


  
  listen(){
    this.server.listen(this.port, this.host, (err) => {
      if (err) { 
        throw new Error(err) 
      } else {
        logger.success('服务启动成功,请访问:', chalk.blue(`${this.host}:${this.port}`))
      }
    })

    return this
  }
}
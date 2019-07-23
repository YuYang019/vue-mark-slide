const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const RunProcess = require('./run')
const logger = require('../utils/logger')
const createTemp = require('./createTemp')

module.exports = class App {
  constructor(options) {
    const { file } = options
    this.filePath = path.resolve(process.cwd(), file)
    this.filename = path.parse(this.filePath).name

    if (!/\.md$/.test(file)) {
      logger.error('文件格式错误，请输入markdown格式的文件')
      process.exit(1)
    }

    if (!fs.existsSync(this.filePath)) {
      logger.error(`${this.filename}.md`, '该文件不存在')
      process.exit(1)
    }

    // 文件所在文件夹路径
    this.dirPath = path.dirname(this.filePath)
    // 配置文件路径
    this.configPath = path.resolve(this.dirPath, 'vslide.config.js')
    // 静态资源路径
    this.assetsPath = path.resolve(this.dirPath, 'assets')

    const { tempPath, writeTemp } = createTemp(this)
    this.tempPath = tempPath
    this.writeTemp = writeTemp
  }

  async process() {
    await Promise.all([
      this.resolveConfig(),
      this.resolveSourceFile(),
      this.resolveAssetFiles()
    ])
  }

  async resolveConfig() {
    const { configPath, tempPath } = this

    let config = {}
    if (fs.existsSync(configPath)) {
      config = require(configPath)
      const dest = path.resolve(tempPath, 'vslide.config.js')
      await fs.copy(configPath, dest)
    } else {
      // 写入空配置
      const dest = path.resolve(tempPath, 'vslide.config.js')
      const code = 'module.exports = {}'
      await fs.writeFile(dest, code)
    }

    this.config = config
  }

  async resolveAssetFiles() {
    const { assetsPath, tempPath } = this
    const dest = path.resolve(tempPath, 'assets')

    await fs.remove(dest)

    if (fs.existsSync(assetsPath)) {
      await fs.copy(assetsPath, dest)
    }
  }

  async resolveSourceFile() {
    const { filePath, tempPath } = this

    if (fs.existsSync(filePath)) {
      const dest = path.resolve(tempPath, 'ppt.md')
      await fs.copy(filePath, dest)
    } else {
      logger.error('源文件不存在', chalk.red(filePath))
      process.exit(1)
    }
  }

  async run() {
    this.runProcess = new RunProcess(this)
    await this.runProcess.process()
    try {
      this.runProcess
        .on('fileChanged', ({ type, target }) => {
          console.log(`Reload due to ${chalk.red(type)} ${chalk.cyan(target)}`)
          this.process()
        })
        .createServer()
        .listen()
    } catch (e) {
      throw e
    }
  }
}

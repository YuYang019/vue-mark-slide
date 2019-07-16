const path = require('path')
const fs = require('fs-extra')
const { enhanceMarked } = require('../client/components/vue-mark-display/parser')
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

    const { tempPath, writeTemp } = createTemp(this)
    this.tempPath = tempPath
    this.writeTemp = writeTemp
  }

  async process() {
    await this.resolveConfig()
  }

  async resolveConfig() {
    const configPath = path.resolve(this.dirPath, 'vslide.config.js')

    let config = {}
    if (fs.existsSync(configPath)) {
      config = require(configPath)  
    } else {
      // 写入空配置
      const dest = path.resolve(this.tempPath, 'vslide.config.js')
      const code = 'module.exports = {}'
      await fs.writeFile(dest, code)
    }

    this.config = config
  }

  async run() {
    this.runProcess = new RunProcess(this)
    await this.runProcess.process()
    try {
      this.runProcess.createServer().listen()
    } catch (e) {
      throw e
    }
  }
}
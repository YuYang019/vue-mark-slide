const path = require('path')
const fs = require('fs-extra')
const RunProcess = require('./run')
const createTemp = require('./createTemp')

module.exports = class App {
  constructor(options) {
    const { file } = options
    this.filePath = path.resolve(process.cwd(), file)

    const { tempPath, writeTemp } = createTemp(this)
    this.tempPath = tempPath
    this.writeTemp = writeTemp
  }

  async process() {
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
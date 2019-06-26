const path = require('path')
const fs = require('fs-extra')
const Cache = require('lru-cache')

module.exports = function createTemp(ctx) {
  const tempPath = path.resolve(__dirname, '../client/.temp')
  const cache = new Cache()

  if (!fs.existsSync(tempPath)) {
    fs.ensureDirSync(tempPath)
  } else {
    fs.emptyDirSync(tempPath)
  }

  async function writeTemp(file, content) {
    const destPath = path.join(tempPath, file)
    await fs.ensureDir(path.parse(destPath).dir)
    const cached = cache.get(file)
    if (cached !== content) {
      await fs.writeFile(destPath, content)
      cache.set(file, content)
    }
    return destPath
  }

  return { tempPath, writeTemp }
}
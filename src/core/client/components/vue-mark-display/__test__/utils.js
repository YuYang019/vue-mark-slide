const fs = require('fs-extra')
const path = require('path')

exports.getFragment = (name) => {
    const file = path.join(__dirname, 'fragments', name)
    return fs.readFileSync(file, 'utf-8')
}
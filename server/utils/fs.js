const util = require('util')
const fs = require('fs')

const writeFile = util.promisify(fs.writeFile)

module.exports = {
  writeFile
}

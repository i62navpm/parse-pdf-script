const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)

module.exports = function fileStreamHandler(file) {
  return readFile(file)
}

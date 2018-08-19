const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function saveFile(filename, data) {
  return writeFile(filename, JSON.stringify(data))
}

function getStreamFile(file) {
  return readFile(file)
}

module.exports = {
  getStreamFile,
  saveFile,
}

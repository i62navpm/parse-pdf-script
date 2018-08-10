const pdfreader = require('pdfreader')
const fs = require('fs')
const util = require('util')
const parsePdf = require('@src/parsePdf')()

module.exports = class Parser {
  constructor(file) {
    this.file = file
    this.readFile = util.promisify(fs.readFile)
  }

  async parse() {
    const fileBuffer = await this.getFileStream(this.file)
    return this.readPdfFile(fileBuffer)
  }

  async getFileStream(file) {
    return this.readFile(file)
  }

  async readPdfFile(buffer) {
    return new Promise((resolve, reject) => {
      new pdfreader.PdfReader().parseBuffer(buffer, (err, item) => {
        if (err) return reject(err)
        else if (!item) return resolve(parsePdf.parseBook())
        else if (item.page) parsePdf.insertPage(item)
        else if (item.text) parsePdf.insertRows(item)
      })
    })
  }
}

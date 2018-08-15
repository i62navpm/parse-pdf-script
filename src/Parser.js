const pdfreader = require('pdfreader')
const parsePdf = require('@src/parsePdf')()

module.exports = class Parser {
  constructor(getFileStream) {
    this.getFileStream = getFileStream
  }

  async parser(file) {
    const fileBuffer = await this.getFileStream(file)
    return this.readPdfFile(fileBuffer)
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

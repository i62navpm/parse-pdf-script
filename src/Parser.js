const pdfreader = require('pdfreader')
const parsePdf = require('@src/parsePdf')

module.exports = class Parser {
  constructor(getFileStream) {
    this.getFileStream = getFileStream
  }

  async parser(file) {
    const fileBuffer = await this.getFileStream(file)
    return this.readPdfFile(file, fileBuffer)
  }

  async readPdfFile(file, buffer) {
    return new Promise((resolve, reject) => {
      let parsePdfFn = parsePdf()
      new pdfreader.PdfReader().parseBuffer(buffer, (err, item) => {
        if (err) return reject(err)
        else if (!item) resolve(parsePdfFn.parseBook(file))
        else if (item.page) parsePdfFn.insertPage(item)
        else if (item.text) parsePdfFn.insertRows(item)
      })
    })
  }
}

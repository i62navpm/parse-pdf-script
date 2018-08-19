require('module-alias/register')

const { getStreamFile, saveFile } = require('./utils/files')
const pdfFiles = require('@config/filesConfig')
const Parser = require('parse-pdf-script')

async function main(list, buffer) {
  const parserFn = new Parser(list, buffer)
  try {
    return parserFn.readPdfFile()
  } catch (err) {
    console.log(err)
  }
}
;(async function() {
  for (const [typeList, lists] of Object.entries(pdfFiles)) {
    console.log(`---> Parsing the "${typeList.toUpperCase()}" lists`)
    for (let [list, filename] of Object.entries(lists)) {
      console.log(`Parsing the "${list.toUpperCase()}" list...`)
      try {
        let data = await getStreamFile(filename)
        data = await main(list, data)
        filename = filename.split('.')[0] + '.json'
        await saveFile(filename, data)
      } catch (err) {
        console.error(err)
      } finally {
        console.log(`Parsed the "${list.toUpperCase()}" succesfully!`)
      }
    }
  }
})()

module.exports = main

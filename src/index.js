require('module-alias/register')
const fs = require('fs')
const Parser = require('@src/Parser')
const debug = require('debug')
const error = debug('app:error')
const log = debug('app:log')

async function main(
  pdfFiles = require('@config/filesConfig'),
  send2File = true
) {
  const outputFile = 'pdfFiles'
  function save2Json(value) {
    const fileRegex = /.*\/(\D+)\.\D{3}/gm
    value.map((data, index) => {
      let filename = pdfFiles[index].replace(fileRegex, `${outputFile}/$1.json`)

      fs.writeFile(filename, JSON.stringify(data), err => {
        if (err) {
          return error(err)
        }

        log(`The file: "${filename}" was saved!`)
      })
    })
  }
  let promises = pdfFiles.map(file => {
    log(`Parsing the file: "${file}"`)
    return new Parser(file)
  })

  let result = await Promise.all(promises)

  send2File && save2Json(result)

  return result
}

module.exports = main

require('module-alias/register')
const fs = require('fs')
const Parser = require('@src/Parser')
const pdfFiles = require('@config/filesConfig')

const outputFile = 'pdfFiles'

function save2Json(value) {
  const fileRegex = /.*\/(\D+)\.\D{3}/gm
  value.map((data, index) => {
    let filename = pdfFiles[index].replace(fileRegex, `${outputFile}/$1.json`)

    fs.writeFile(filename, JSON.stringify(data), err => {
      if (err) {
        return console.log(err)
      }

      console.log(`\nThe file: "${filename}" was saved!\n`)
    })
  })
}
let promises = pdfFiles.map(file => {
  console.log(`\nParsing the file: "${file}"\n`)
  return new Parser(file)
})

Promise.all(promises).then(save2Json)

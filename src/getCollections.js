const watchFiles = require('@config/watchFiles')

module.exports = function getCollection(filename) {
  const fileRegex = /.*\/(\D+)/gm
  filename = filename.replace(fileRegex, `$1`)

  function parseLists(book) {
    return book.reduce((acc, { specialty, header, opponents }) => {
      acc[specialty] = opponents.map(opp => {
        return header.reduce((acc, curr, index) => {
          if (!opp[index]) return acc
          const [keyOpp, posXOpp] = opp[index].split('>>>')
          let [keyHeader, posXHeader] = curr.split('>>>')

          if (keyHeader === '2' && posXHeader !== posXOpp) {
            const [keyHeaderNext] = header[index + 1].split('>>>')
            keyHeader = keyHeaderNext
          }
          acc[keyHeader.replace(/\s/g, '').toLowerCase()] = keyOpp.toLowerCase()
          return acc
        }, {})
      })

      return acc
    }, {})
  }

  function parseAssignments(book) {
    function splitCustomHeader(header) {
      function swap(lsitHeader, x, y) {
        let b = lsitHeader[x]
        lsitHeader[x] = lsitHeader[y]
        lsitHeader[y] = b
        return this
      }

      const [headerKeysFirst, posXFirst] = header[2].split('>>>')
      const [splitHeadersFirst1, splitHeadersFirst2] = headerKeysFirst.split(
        ' '
      )
      header[2] = `${splitHeadersFirst1}>>>${posXFirst}`
      header.splice(3, 0, `${splitHeadersFirst2}>>>${posXFirst}`)

      const [headerKeysSecond, posXSecond] = header[4].split('>>>')
      const [splitHeadersSecond1, splitHeadersSecond2] = headerKeysSecond.split(
        ' '
      )
      header[4] = `${splitHeadersSecond1}>>>${posXSecond}`
      header.splice(5, 0, `${splitHeadersSecond2}>>>${posXSecond}`)

      header.splice(8, 0, `Tipo Vac.`)

      swap(header, 5, 4)
      swap(header, 8, 5)
      swap(header, 8, 6)
      swap(header, 8, 7)
      return true
    }

    let customHeader
    book = book.reduce((acc, { specialty, header, opponents }) => {
      acc[specialty] = opponents.map(opp => {
        if (!customHeader) customHeader = splitCustomHeader(header)
        return header.reduce((acc, curr, index) => {
          if (!opp[index]) return acc
          const [keyOpp] = opp[index].split('>>>')
          let [keyHeader] = curr.split('>>>')

          if (
            (keyHeader === 'Acceso2' && keyOpp !== 'Sí') ||
            (keyHeader === 'DAT' && keyOpp.indexOf('DAT') === -1)
          ) {
            const [keyHeaderNext] = header[index + 1].split('>>>')
            keyHeader = keyHeaderNext
          }
          acc[keyHeader.replace(/\s/g, '').toLowerCase()] = keyOpp.toLowerCase()

          return acc
        }, {})
      })

      return acc
    }, {})

    return book
  }

  return watchFiles.includes(filename) ? parseAssignments : parseLists
}

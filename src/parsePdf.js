const regexs = require('@config/regexRules')
const getCollection = require('./getCollections')

module.exports = function(page = 1, book = { [page]: [] }, rows = {}) {
  function insertRows(item) {
    const posY = +item.y.toFixed(2)

    const posX = +item.x.toFixed(0)

    rows[posY] = !rows[posY]
      ? [`${item.text.trim()}>>>${posX}`]
      : [...rows[posY], `${item.text.trim()}>>>${posX}`]
  }

  function insertPage(item) {
    book[page] = sortRows(page)
    page = item.page
    rows = {}
  }

  function sortRows() {
    return Object.keys(rows)
      .sort((y1, y2) => y1 - y2)
      .map(y => rows[y])
  }

  function parseBook(filename) {
    const getCollect = getCollection(filename)
    let header = []

    book[page] = sortRows(page)

    book = Object.values(
      Object.values(book)
        .map(page => {
          const [specialty] = getSpecialty(page)
          if (!header.length) header = getHeader(page)
          let opponents = getOpponents(page)

          return {
            specialty,
            header,
            opponents,
          }
        })
        .reduce((acc, curr) => {
          if (acc[curr.specialty]) {
            acc[curr.specialty].opponents = [
              ...acc[curr.specialty].opponents,
              ...curr.opponents,
            ]
          } else {
            acc[curr.specialty] = curr
          }
          return acc
        }, {})
    )
    book = getCollect(book)
    return book
  }

  function getSpecialty(page) {
    return page
      .find(
        (row = []) =>
          row.findIndex(element => element.match(regexs.specialtyRegx)) !== -1
      )
      .filter(element => !element.match(regexs.specialtyRegx))
  }

  function getHeader(page) {
    return page.find(
      (row = []) =>
        row.findIndex(element => element.match(regexs.headerRegx)) !== -1
    )
  }

  function getOpponents(page) {
    return page.filter(item =>
      item.some(
        element =>
          element.match(regexs.opponentsRegexA) ||
          element.match(regexs.opponentsRegexB)
      )
    )
  }

  return {
    insertRows,
    insertPage,
    parseBook,
  }
}

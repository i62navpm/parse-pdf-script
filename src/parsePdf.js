const regexs = require('@config/regexRules')

module.exports = function(page = 1, book = { [page]: [] }, rows = {}) {
  function insertRows(item) {
    const posY = +item.y.toFixed(2)

    rows[posY] = !rows[posY]
      ? [item.text.trim()]
      : [...rows[posY], item.text.trim()]
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

  function parseBook() {
    book[page] = sortRows(page)

    let header = []
    return Object.values(book).map(page => {
      const [specialty] = getSpecialty(page)
      if (!header.length) header = getHeader(page)
      let opponents = getOpponents(page)

      return {
        specialty,
        header,
        opponents,
      }
    })
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

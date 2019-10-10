// https://github.com/testing-library/jest-dom/blob/v4.1.2/src/__tests__/helpers/document.js
if (global.document) {
  module.exports = global.document
} else {
  const {JSDOM} = require('jsdom')
  const {window} = new JSDOM()

  module.exports = window.document
}

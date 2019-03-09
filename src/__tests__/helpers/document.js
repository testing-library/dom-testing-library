let testWindow = typeof window === 'undefined' ? undefined : window

if (typeof window === 'undefined') {
  const {JSDOM} = require('jsdom')
  const dom = new JSDOM()
  testWindow = dom.window
  global.window = testWindow
}

module.exports = testWindow.document

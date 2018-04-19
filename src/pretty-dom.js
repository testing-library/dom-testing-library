import prettyFormat from 'pretty-format'

const {DOMElement, DOMCollection} = prettyFormat.plugins

function prettyDOM(htmlElement) {
  const debugContent = prettyFormat(htmlElement, {
    plugins: [DOMElement, DOMCollection],
    printFunctionName: false,
    highlight: true,
  })
  const maxLength = process.env.DEBUG_PRINT_LIMIT || 7000
  return htmlElement.outerHTML.length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent
}

function logDOM(htmlElement) {
  // eslint-disable-next-line no-console
  console.log(prettyDOM(htmlElement))
}

export {prettyDOM, logDOM}

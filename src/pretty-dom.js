import prettyFormat from 'pretty-format'

const {DOMElement, DOMCollection} = prettyFormat.plugins

function prettyDOM(htmlElement, maxLength = undefined) {
  const debugContent = prettyFormat(htmlElement, {
    plugins: [DOMElement, DOMCollection],
    printFunctionName: false,
    highlight: true,
  })
  return maxLength !== undefined && htmlElement.outerHTML.length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent
}

function logDOM(htmlElement, maxLength = undefined) {
  // eslint-disable-next-line no-console
  console.log(prettyDOM(htmlElement, maxLength))
}

export {prettyDOM, logDOM}

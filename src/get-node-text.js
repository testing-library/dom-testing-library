const TEXT_NODE = 3
function getNodeText(node) {
  if (node.matches('input[type=submit], input[type=button]')) {
    return node.value
  }

  return Array.from(node.childNodes)
    .filter(child => child.nodeType === TEXT_NODE && Boolean(child.textContent))
    .map(c => c.textContent)
    .join('')
}

export {getNodeText}

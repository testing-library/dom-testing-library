function getNodeText(node) {
  const window = node.ownerDocument.defaultView

  if (node.matches('input[type=submit], input[type=button]')) {
    return node.value
  }

  return Array.from(node.childNodes)
    .filter(
      child =>
        child.nodeType === window.Node.TEXT_NODE && Boolean(child.textContent),
    )
    .map(c => c.textContent)
    .join('')
}

export {getNodeText}

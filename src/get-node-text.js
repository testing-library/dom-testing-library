function getNodeText(node) {
  return Array.from(node.childNodes)
    .filter(
      child => child.nodeType === Node.TEXT_NODE && Boolean(child.textContent),
    )
    .map(c => c.textContent)
    .join(' ')
}

export {getNodeText}

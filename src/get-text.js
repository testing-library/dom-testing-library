function getText(node) {
  return Array.from(node.childNodes)
    .filter(
      child => child.nodeType === Node.TEXT_NODE && Boolean(child.textContent),
    )
    .map(c => c.textContent)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')
}

export {getText}

function fuzzyMatches(textToMatch, node, matcher, collapseWhitespace = true) {
  if (typeof textToMatch !== 'string') {
    return false
  }
  const normalizedText = collapseWhitespace
    ? textToMatch.trim().replace(/\s+/g, ' ')
    : textToMatch
  if (typeof matcher === 'string') {
    return normalizedText.toLowerCase().includes(matcher.toLowerCase())
  } else if (typeof matcher === 'function') {
    return matcher(normalizedText, node)
  } else {
    return matcher.test(normalizedText)
  }
}

function matches(textToMatch, node, matcher, collapseWhitespace = false) {
  if (typeof textToMatch !== 'string') {
    return false
  }
  const normalizedText = collapseWhitespace
    ? textToMatch.trim().replace(/\s+/g, ' ')
    : textToMatch
  if (typeof matcher === 'string') {
    return normalizedText === matcher
  } else if (typeof matcher === 'function') {
    return matcher(normalizedText, node)
  } else {
    return matcher.test(normalizedText)
  }
}

export {fuzzyMatches, matches}

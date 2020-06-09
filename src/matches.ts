export type MatcherFunction = (content: string, element: HTMLElement) => boolean

export type Matcher = string | RegExp | MatcherFunction

export type NormalizerFn = (text: string) => string

export interface MatcherOptions {
  exact?: boolean
  /** Use normalizer with getDefaultNormalizer instead */
  trim?: boolean
  /** Use normalizer with getDefaultNormalizer instead */
  collapseWhitespace?: boolean
  normalizer?: NormalizerFn
  /** suppress suggestions for a specific query */
  suggest?: boolean
}

function fuzzyMatches(
  textToMatch: string,
  node: HTMLElement | null,
  matcher: Matcher,
  normalizer: NormalizerFn,
) {
  if (typeof textToMatch !== 'string') {
    return false
  }

  const normalizedText = normalizer(textToMatch)
  if (typeof matcher === 'string') {
    return normalizedText.toLowerCase().includes(matcher.toLowerCase())
  } else if (typeof matcher === 'function') {
    return matcher(normalizedText, node)
  } else {
    return matcher.test(normalizedText)
  }
}

function matches(
  textToMatch: string,
  node: HTMLElement | null,
  matcher: Matcher,
  normalizer: NormalizerFn,
) {
  if (typeof textToMatch !== 'string') {
    return false
  }

  const normalizedText = normalizer(textToMatch)
  if (typeof matcher === 'string') {
    return normalizedText === matcher
  } else if (typeof matcher === 'function') {
    return matcher(normalizedText, node)
  } else {
    return matcher.test(normalizedText)
  }
}

export interface DefaultNormalizerOptions {
  trim?: boolean
  collapseWhitespace?: boolean
}

function getDefaultNormalizer({
  trim = true,
  collapseWhitespace = true,
}: DefaultNormalizerOptions = {}): NormalizerFn {
  return text => {
    let normalizedText = text
    normalizedText = trim ? normalizedText.trim() : normalizedText
    normalizedText = collapseWhitespace
      ? normalizedText.replace(/\s+/g, ' ')
      : normalizedText
    return normalizedText
  }
}

/**
 * Constructs a normalizer to pass to functions in matches.js
 * @param {boolean|undefined} trim The user-specified value for `trim`, without
 * any defaulting having been applied
 * @param {boolean|undefined} collapseWhitespace The user-specified value for
 * `collapseWhitespace`, without any defaulting having been applied
 * @param {Function|undefined} normalizer The user-specified normalizer
 * @returns {Function} A normalizer
 */
function makeNormalizer({trim, collapseWhitespace, normalizer}): NormalizerFn {
  if (normalizer) {
    // User has specified a custom normalizer
    if (
      typeof trim !== 'undefined' ||
      typeof collapseWhitespace !== 'undefined'
    ) {
      // They've also specified a value for trim or collapseWhitespace
      throw new Error(
        'trim and collapseWhitespace are not supported with a normalizer. ' +
          'If you want to use the default trim and collapseWhitespace logic in your normalizer, ' +
          'use "getDefaultNormalizer({trim, collapseWhitespace})" and compose that into your normalizer',
      )
    }

    return normalizer
  } else {
    // No custom normalizer specified. Just use default.
    return getDefaultNormalizer({trim, collapseWhitespace})
  }
}

export {fuzzyMatches, matches, getDefaultNormalizer, makeNormalizer}

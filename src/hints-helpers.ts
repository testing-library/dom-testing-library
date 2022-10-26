import {Matcher} from '../types'

function getMatcherHint(matcher: Matcher, prefixForRegex: string) {
  if (matcher instanceof RegExp) {
    return `${
      prefixForRegex ? `${prefixForRegex}` : 'that'
    } match the regex: ${matcher}`
  }

  if (typeof matcher === 'function') {
    let customMatcherText: string = ''

    if (
      matcher.customMatcherText &&
      typeof matcher.customMatcherText === 'string'
    ) {
      customMatcherText = matcher.customMatcherText
    } else {
      customMatcherText = matcher.name || '[anonymous function]'
    }

    return `that match the custom matcher${
      customMatcherText ? `: ${customMatcherText}` : ''
    }`
  }
}

export {getMatcherHint}

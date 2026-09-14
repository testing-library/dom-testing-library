import {Matcher} from '../types'

function getMatcherHint(matcher: Matcher, prefixForRegex: string) {
  if (matcher instanceof RegExp) {
    return `${prefixForRegex} match the regex: ${matcher}`
  }

  if (typeof matcher === 'function') {
    let customMatcherText: string = matcher.name || '[anonymous function]'

    if (
      matcher.customMatcherText &&
      typeof matcher.customMatcherText === 'string'
    ) {
      customMatcherText = matcher.customMatcherText
    }

    return `that match the custom matcher: ${customMatcherText}`
  }
}

export {getMatcherHint}

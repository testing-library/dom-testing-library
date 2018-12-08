export type MatcherFunction = (content: string, element: HTMLElement) => boolean
export type Matcher = string | RegExp | MatcherFunction

export type NormalizerFn = (text: string) => string

export interface MatcherOptions {
  exact?: boolean
  trim?: boolean
  collapseWhitespace?: boolean
  normalizer?: NormalizerFn
}

export type Match = (
  textToMatch: string,
  node: HTMLElement | null,
  matcher: Matcher,
  options?: MatcherOptions,
) => boolean

export const fuzzyMatches: Match
export const matches: Match

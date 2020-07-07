import {ARIARole} from 'aria-query'

export type MatcherFunction = (content: string, element: HTMLElement) => boolean
export type Matcher = string | RegExp | MatcherFunction

// Allow `String` to have intellisense for roles while writing ByRole queries
// If `string` is used it overrules the ARIARole string union types
// resulting in no intellisense
// We still want to support roles not included in the union type
/* tslint:disable:ban-types */
export type ByRoleMatcher = ARIARole | String | RegExp | MatcherFunction

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

export type Match = (
  textToMatch: string,
  node: HTMLElement | null,
  matcher: Matcher,
  options?: MatcherOptions,
) => boolean

export interface DefaultNormalizerOptions {
  trim?: boolean
  collapseWhitespace?: boolean
}

export function getDefaultNormalizer(
  options?: DefaultNormalizerOptions,
): NormalizerFn

// N.B. Don't expose fuzzyMatches + matches here: they're not public API

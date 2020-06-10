export declare type MatcherFunction = (
  content: string,
  element: HTMLElement,
) => boolean
export declare type Matcher = string | RegExp | MatcherFunction
export declare type NormalizerFn = (text: string) => string
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
declare function fuzzyMatches(
  textToMatch: string,
  node: HTMLElement | null,
  matcher: Matcher,
  normalizer: NormalizerFn,
): boolean
declare function matches(
  textToMatch: string,
  node: HTMLElement | null,
  matcher: Matcher,
  normalizer: NormalizerFn,
): boolean
export interface DefaultNormalizerOptions {
  trim?: boolean
  collapseWhitespace?: boolean
}
declare function getDefaultNormalizer({
  trim,
  collapseWhitespace,
}?: DefaultNormalizerOptions): NormalizerFn
/**
 * Constructs a normalizer to pass to functions in matches.js
 * @param {boolean|undefined} trim The user-specified value for `trim`, without
 * any defaulting having been applied
 * @param {boolean|undefined} collapseWhitespace The user-specified value for
 * `collapseWhitespace`, without any defaulting having been applied
 * @param {Function|undefined} normalizer The user-specified normalizer
 * @returns {Function} A normalizer
 */
declare function makeNormalizer({
  trim,
  collapseWhitespace,
  normalizer,
}: {
  trim: any
  collapseWhitespace: any
  normalizer: any
}): NormalizerFn
export {fuzzyMatches, matches, getDefaultNormalizer, makeNormalizer}

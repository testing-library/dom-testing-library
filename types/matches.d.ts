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

export interface ByRoleOptions extends MatcherOptions {
  /**
   * If true includes elements in the query set that are usually excluded from
   * the accessibility tree. `role="none"` or `role="presentation"` are included
   * in either case.
   */
  hidden?: boolean
  /**
   * If true only includes elements in the query set that are marked as
   * selected in the accessibility tree, i.e., `aria-selected="true"`
   */
  selected?: boolean
  /**
   * Includes every role used in the `role` attribute
   * For example *ByRole('progressbar', {queryFallbacks: true})` will find <div role="meter progressbar">`.
   */
  queryFallbacks?: boolean
  /**
   * Only considers  elements with the specified accessible name.
   */
  name?:
    | string
    | RegExp
    | ((accessibleName: string, element: Element) => boolean)
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

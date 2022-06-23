export type QueryElement = {
  <T, K extends keyof HTMLElementTagNameMap>(container: T, selectors: K):
    | HTMLElementTagNameMap[K]
    | null
  <T, K extends keyof SVGElementTagNameMap>(container: T, selectors: K):
    | SVGElementTagNameMap[K]
    | null
  <T, E extends Element = Element>(container: T, selectors: string): E | null
}
export type QueryAllElements = {
  <T, K extends keyof HTMLElementTagNameMap>(
    container: T,
    selectors: K,
  ): NodeListOf<HTMLElementTagNameMap[K]>
  <T, K extends keyof SVGElementTagNameMap>(
    container: T,
    selectors: K,
  ): NodeListOf<SVGElementTagNameMap[K]>
  <T, E extends Element = Element>(
    container: T,
    selectors: string,
  ): NodeListOf<E>
}

export interface Config {
  testIdAttribute: string
  /**
   * WARNING: `unstable` prefix means this API may change in patch and minor releases.
   * @param cb
   */
  unstable_advanceTimersWrapper(cb: (...args: unknown[]) => unknown): unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncWrapper(cb: (...args: any[]) => any): Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventWrapper(cb: (...args: any[]) => any): void
  asyncUtilTimeout: number
  computedStyleSupportsPseudoElements: boolean
  defaultHidden: boolean
  /** default value for the `ignore` option in `ByText` queries */
  defaultIgnore: string
  showOriginalStackTrace: boolean
  throwSuggestions: boolean
  /**
   * Returns the first element that is a descendant of node that matches selectors.
   */
  queryElement: QueryElement
  /**
   * Returns all element descendants of node that match selectors.
   */
  queryAllElements: QueryAllElements
  getElementError: (message: string | null, container: Element) => Error
}

export interface ConfigFn {
  (existingConfig: Config): Partial<Config>
}

export function configure(configDelta: ConfigFn | Partial<Config>): void
export function getConfig(): Config

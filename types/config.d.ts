export interface Config {
  testIdAttribute: string
  asyncWrapper(cb: (...args: any[]) => any): Promise<any>
  eventWrapper(cb: (...args: any[]) => any): void
  getElementError: (message: string, container: Element) => Error
  asyncUtilTimeout: number
  defaultHidden: boolean
  showOriginalStackTrace: boolean
  throwSuggestions: boolean
}
interface InternalConfig {
  _disableExpensiveErrorDiagnostics: boolean
}
export declare const DEFAULT_IGNORE_TAGS = 'script, style'
export declare function runWithExpensiveErrorDiagnosticsDisabled(
  callback: any,
): any
export interface ConfigFn {
  (existingConfig: Config): Partial<Config>
}
export declare function configure(newConfig: Partial<Config> | ConfigFn): void
export declare function getConfig(): Config & InternalConfig
export {}

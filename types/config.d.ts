export interface Config {
  testIdAttribute: string
  asyncWrapper<T>(cb: () => Promise<T>): Promise<T>
  eventWrapper(cb: () => void): void
  asyncUtilTimeout: number
  computedStyleSupportsPseudoElements: boolean
  defaultHidden: boolean
  showOriginalStackTrace: boolean
  throwSuggestions: boolean
  getElementError: (message: string | null, container: Node) => Error
}

export interface ConfigFn {
  (existingConfig: Config): Partial<Config>
}

export function configure(configDelta: ConfigFn | Partial<Config>): void
export function getConfig(): Config

export interface Config {
  testIdAttribute: string
  asyncWrapper(cb: (...args: any[]) => any): Promise<any>
  eventWrapper(cb: (...args: any[]) => any): void
  asyncUtilTimeout: number
  defaultHidden: boolean
  throwSuggestions: boolean
}

export interface ConfigFn {
  (existingConfig: Config): Partial<Config>
}

export function configure(configDelta: Partial<Config> | ConfigFn): void
export function getConfig(): Config

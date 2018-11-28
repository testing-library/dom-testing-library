export interface IConfig {
  testIdAttribute: string
}

export function configure(configDelta: Partial<IConfig>): void

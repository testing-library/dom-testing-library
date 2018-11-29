export interface IConfig {
  testIdAttribute: string
}

export interface IConfigFn {
  (existingConfig: IConfig): Partial<IConfig>
}

export function configure(configDelta: Partial<IConfig> | IConfigFn): void

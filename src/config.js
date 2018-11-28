// It would be cleaner for this to live inside './queries', but
// other parts of the code assume that all exports from
// './queries' are query functions.
let config = {
  testIdAttribute: 'data-testid',
}

export function configure(configDelta) {
  config = {
    ...config,
    ...configDelta,
  }
}
export function getTestIdAttribute() {
  return config.testIdAttribute
}

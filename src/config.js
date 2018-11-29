// It would be cleaner for this to live inside './queries', but
// other parts of the code assume that all exports from
// './queries' are query functions.
let config = {
  testIdAttribute: 'data-testid',
}

export function configure(newConfig) {
  if (typeof newConfig === 'function') {
    // Pass the existing config out to the provided function
    // and accept a delta in return
    newConfig = newConfig(config)
  }

  // Merge the incoming config delta
  config = {
    ...config,
    ...newConfig,
  }
}

export function getConfig() {
  return config
}

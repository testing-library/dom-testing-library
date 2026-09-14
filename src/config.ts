import {Config, ConfigFn} from '../types/config'
import {prettyDOM} from './pretty-dom'

type Callback<T> = () => T
interface InternalConfig extends Config {
  _disableExpensiveErrorDiagnostics: boolean
}

// It would be cleaner for this to live inside './queries', but
// other parts of the code assume that all exports from
// './queries' are query functions.
let config: InternalConfig = {
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 1000,
  // asyncWrapper and advanceTimersWrapper is to support React's async `act` function.
  // forcing react-testing-library to wrap all async functions would've been
  // a total nightmare (consider wrapping every findBy* query and then also
  // updating `within` so those would be wrapped too. Total nightmare).
  // so we have this config option that's really only intended for
  // react-testing-library to use. For that reason, this feature will remain
  // undocumented.
  // Turns out other libraries did use that (user-event).
  // Not actually used by DTL but rather by user-event which uses act() from RTL
  /* istanbul ignore next */
  asyncWrapper: /* istanbul ignore next */ cb =>
    /* istanbul ignore next */ cb(),
  // For compat with libraries that used asyncWrapper, we add a more specific
  // "waitForWrapper" that makes it more clear that this is only meant for waitFor.
  // RTL will use this instead to disable act() during that scope while user-event
  // can keep relying on the semantics for asyncWrapper.
  waitForWrapper: cb => cb(),
  unstable_advanceTimersWrapper: cb => cb(),
  eventWrapper: cb => cb(),
  // default value for the `hidden` option in `ByRole` queries
  defaultHidden: false,
  // default value for the `ignore` option in `ByText` queries
  defaultIgnore: 'script, style',
  // showOriginalStackTrace flag to show the full error stack traces for async errors
  showOriginalStackTrace: false,

  // throw errors w/ suggestions for better queries. Opt in so off by default.
  throwSuggestions: false,

  // called when getBy* queries fail. (message, container) => Error
  getElementError(message, container) {
    const prettifiedDOM = prettyDOM(container)
    const error = new Error(
      [
        message,
        `Ignored nodes: comments, ${config.defaultIgnore}\n${prettifiedDOM}`,
      ]
        .filter(Boolean)
        .join('\n\n'),
    )
    error.name = 'TestingLibraryElementError'
    return error
  },
  _disableExpensiveErrorDiagnostics: false,
  computedStyleSupportsPseudoElements: false,
}

export function runWithExpensiveErrorDiagnosticsDisabled<T>(
  callback: Callback<T>,
) {
  try {
    config._disableExpensiveErrorDiagnostics = true
    return callback()
  } finally {
    config._disableExpensiveErrorDiagnostics = false
  }
}

export function configure(newConfig: ConfigFn | Partial<Config>) {
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

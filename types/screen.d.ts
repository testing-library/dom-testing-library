import {BoundFunctions, Queries} from './get-queries-for-element'
import {OptionsReceived} from 'pretty-format'

export type Screen = BoundFunctions & {
  /**
   * Convenience function for `pretty-dom` which also allows an array
   * of elements
   */
  debug: (
    element?: Element | HTMLDocument | Array<Element | HTMLDocument>,
    maxLength?: number,
    options?: OptionsReceived,
  ) => void
}

export const screen: Screen

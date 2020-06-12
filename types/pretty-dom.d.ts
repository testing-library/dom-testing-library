import {OptionsReceived} from 'pretty-format'
declare global {
  namespace NodeJS {
    interface Global {
      Cypress?: any
    }
  }
}
declare function prettyDOM(
  dom?: Element | Document,
  maxLength?: number,
  options?: OptionsReceived,
): string
declare const logDOM: (
  dom?: Element | HTMLDocument,
  maxLength?: number,
  options?: OptionsReceived,
) => void
export {prettyDOM, logDOM}

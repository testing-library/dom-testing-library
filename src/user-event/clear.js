import {wrapAsync} from '../wrap-async'
import {isInputElement} from './utils'
import {type} from './type'

async function clear(element) {
  if (element.disabled) return
  // TODO: track the selection range ourselves so we don't have to do this input "type" trickery
  // just like cypress does: https://github.com/cypress-io/cypress/blob/8d7f1a0bedc3c45a2ebf1ff50324b34129fdc683/packages/driver/src/dom/selection.ts#L16-L37
  const elementType = element.type
  // type is a readonly property on textarea, so check if element is an input before trying to modify it
  if (isInputElement(element)) {
    // setSelectionRange is not supported on certain types of inputs, e.g. "number" or "email"
    element.type = 'text'
  }
  await type(element, '{selectall}{del}')
  if (isInputElement(element)) {
    element.type = elementType
  }
}
clear = wrapAsync(clear)

export {clear}

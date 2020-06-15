import {getConfig as getDOMTestingLibraryConfig} from '../config'
import {fireEvent, getActiveElement, calculateNewValue} from './utils'

// this needs to be wrapped in the asyncWrapper for React's act and angular's change detection
async function paste(...args) {
  let result
  await getDOMTestingLibraryConfig().asyncWrapper(async () => {
    result = await pasteImpl(...args)
  })
  return result
}

// eslint-disable-next-line complexity
async function pasteImpl(
  element,
  text,
  {initialSelectionStart, initialSelectionEnd} = {},
) {
  if (element.disabled) return

  element.focus()

  // The focused element could change between each event, so get the currently active element each time
  const currentElement = () => getActiveElement(element.ownerDocument)
  const currentValue = () => currentElement().value
  const setSelectionRange = ({newValue, newSelectionStart}) => {
    // if we *can* change the selection start, then we will if the new value
    // is the same as the current value (so it wasn't programatically changed
    // when the fireEvent.input was triggered).
    // The reason we have to do this at all is because it actually *is*
    // programmatically changed by fireEvent.input, so we have to simulate the
    // browser's default behavior
    if (
      currentElement().selectionStart !== null &&
      currentValue() === newValue
    ) {
      currentElement().setSelectionRange?.(newSelectionStart, newSelectionStart)
    }
  }

  // by default, a new element has it's selection start and end at 0
  // but most of the time when people call "paste", they expect it to paste
  // at the end of the current input value. So, if the selection start
  // and end are both the default of 0, then we'll go ahead and change
  // them to the length of the current value.
  // the only time it would make sense to pass the initialSelectionStart or
  // initialSelectionEnd is if you have an input with a value and want to
  // explicitely start typing with the cursor at 0. Not super common.
  if (
    currentElement().selectionStart === 0 &&
    currentElement().selectionEnd === 0
  ) {
    currentElement().setSelectionRange(
      initialSelectionStart ?? currentValue()?.length ?? 0,
      initialSelectionEnd ?? currentValue()?.length ?? 0,
    )
  }

  if (!element.readOnly) {
    const {newValue, newSelectionStart} = calculateNewValue(
      text,
      currentElement(),
    )
    await fireEvent.input(element, {
      target: {value: newValue},
    })
    setSelectionRange({newValue, newSelectionStart})
  }
}

export {paste}

import {
  getConfig as getDOMTestingLibraryConfig,
  fireEvent,
} from '@testing-library/dom'

// this needs to be wrapped in the asyncWrapper for React's act and angular's change detection
async function paste(...args) {
  let result
  await getDOMTestingLibraryConfig().asyncWrapper(async () => {
    result = await pasteImpl(...args)
  })
  return result
}

const getActiveElement = document => {
  const activeElement = document.activeElement
  if (activeElement.shadowRoot) {
    return getActiveElement(activeElement.shadowRoot) || activeElement
  } else {
    return activeElement
  }
}

// eslint-disable-next-line complexity
function pasteImpl(
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
    const {newValue, newSelectionStart} = calculateNewValue(text)
    fireEvent.input(element, {
      target: {value: newValue},
    })
    setSelectionRange({newValue, newSelectionStart})
  }

  function calculateNewValue(newEntry) {
    const {selectionStart, selectionEnd} = currentElement()
    // can't use .maxLength property because of a jsdom bug:
    // https://github.com/jsdom/jsdom/issues/2927
    const maxLength = Number(currentElement().getAttribute('maxlength') ?? -1)
    const value = currentValue()
    let newValue, newSelectionStart

    if (selectionStart === null) {
      // at the end of an input type that does not support selection ranges
      // https://github.com/testing-library/user-event/issues/316#issuecomment-639744793
      newValue = value + newEntry
    } else if (selectionStart === selectionEnd) {
      if (selectionStart === 0) {
        // at the beginning of the input
        newValue = newEntry + value
      } else if (selectionStart === value.length) {
        // at the end of the input
        newValue = value + newEntry
      } else {
        // in the middle of the input
        newValue =
          value.slice(0, selectionStart) + newEntry + value.slice(selectionEnd)
      }
      newSelectionStart = selectionStart + newEntry.length
    } else {
      // we have something selected
      const firstPart = value.slice(0, selectionStart) + newEntry
      newValue = firstPart + value.slice(selectionEnd)
      newSelectionStart = firstPart.length
    }

    if (maxLength < 0) {
      return {newValue, newSelectionStart}
    } else {
      return {
        newValue: newValue.slice(0, maxLength),
        newSelectionStart:
          newSelectionStart > maxLength ? maxLength : newSelectionStart,
      }
    }
  }
}

export {paste}

import {wrapAsync} from '../wrap-async'
import {fireEvent} from './utils'
import {tick} from './tick'

function wait(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time))
}

const getActiveElement = document => {
  const activeElement = document.activeElement
  if (activeElement.shadowRoot) {
    return getActiveElement(activeElement.shadowRoot)
  } else {
    return activeElement
  }
}

// eslint-disable-next-line complexity
async function type(
  element,
  text,
  {allAtOnce = false, delay, initialSelectionStart, initialSelectionEnd} = {},
) {
  if (element.disabled) return

  element.focus()

  // The focused element could change between each event, so get the currently active element each time
  // This is why most of the utilities are within the type function itself. If
  // they weren't, then we'd have to pass the "currentElement" function to them
  // as an argument, which would be fine, but make sure that you pass the function
  // and not just the element if the active element could change while the function
  // is being run (for example, functions that are async and/or fire events).
  const currentElement = () => getActiveElement(element.ownerDocument)
  const currentValue = () => currentElement().value
  const setSelectionRange = ({newValue, newSelectionStart}) => {
    // if we *can* change the selection start, then we will if the new value
    // is the same as the current value (so it wasn't programatically changed
    // when the await fireEvent.input was triggered).
    // The reason we have to do this at all is because it actually *is*
    // programmatically changed by await fireEvent.input, so we have to simulate the
    // browser's default behavior
    const el = currentElement()
    const {selectionStart, selectionEnd} = el
    if (
      selectionStart !== null &&
      currentValue() === newValue &&
      el.setSelectionRange &&
      (selectionStart !== newSelectionStart ||
        selectionEnd !== newSelectionStart)
    ) {
      el.setSelectionRange(newSelectionStart, newSelectionStart)
    }
  }

  // by default, a new element has it's selection start and end at 0
  // but most of the time when people call "type", they expect it to type
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
      initialSelectionStart ?? currentValue().length,
      initialSelectionEnd ?? currentValue().length,
    )
  }

  if (allAtOnce) {
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
  } else {
    const eventCallbackMap = {
      ...modifier({
        name: 'shift',
        key: 'Shift',
        keyCode: 16,
        modifierProperty: 'shiftKey',
      }),
      ...modifier({
        name: 'ctrl',
        key: 'Control',
        keyCode: 17,
        modifierProperty: 'ctrlKey',
      }),
      ...modifier({
        name: 'alt',
        key: 'Alt',
        keyCode: 18,
        modifierProperty: 'altKey',
      }),
      ...modifier({
        name: 'meta',
        key: 'Meta',
        keyCode: 93,
        modifierProperty: 'metaKey',
      }),
      '{enter}': async ({eventOverrides}) => {
        const key = 'Enter'
        const keyCode = 13

        const keyDownDefaultNotPrevented = await fireEvent.keyDown(
          currentElement(),
          {
            key,
            keyCode,
            which: keyCode,
            ...eventOverrides,
          },
        )

        if (keyDownDefaultNotPrevented) {
          await fireEvent.keyPress(currentElement(), {
            key,
            keyCode,
            charCode: keyCode,
            ...eventOverrides,
          })
        }

        if (currentElement().tagName === 'BUTTON') {
          await fireEvent.click(currentElement(), {
            ...eventOverrides,
          })
        }

        if (currentElement().tagName === 'TEXTAREA') {
          const {newValue, newSelectionStart} = calculateNewValue(
            '\n',
            currentElement(),
          )
          await fireEvent.input(currentElement(), {
            target: {value: newValue},
            inputType: 'insertLineBreak',
            ...eventOverrides,
          })
          setSelectionRange({newValue, newSelectionStart})
        }

        await fireEvent.keyUp(currentElement(), {
          key,
          keyCode,
          which: keyCode,
          ...eventOverrides,
        })
      },
      '{esc}': async ({eventOverrides}) => {
        const key = 'Escape'
        const keyCode = 27

        await fireEvent.keyDown(currentElement(), {
          key,
          keyCode,
          which: keyCode,
          ...eventOverrides,
        })

        // NOTE: Browsers do not fire a keypress on meta key presses

        await fireEvent.keyUp(currentElement(), {
          key,
          keyCode,
          which: keyCode,
          ...eventOverrides,
        })
      },
      '{del}': async ({eventOverrides}) => {
        const key = 'Delete'
        const keyCode = 46

        const keyPressDefaultNotPrevented = await fireEvent.keyDown(
          currentElement(),
          {
            key,
            keyCode,
            which: keyCode,
            ...eventOverrides,
          },
        )

        if (keyPressDefaultNotPrevented) {
          await fireInputEventIfNeeded({
            ...calculateNewDeleteValue(currentElement()),
            eventOverrides: {
              inputType: 'deleteContentForward',
              ...eventOverrides,
            },
          })
        }

        await fireEvent.keyUp(currentElement(), {
          key,
          keyCode,
          which: keyCode,
          ...eventOverrides,
        })
      },
      '{backspace}': async ({eventOverrides}) => {
        const key = 'Backspace'
        const keyCode = 8

        const keyPressDefaultNotPrevented = await fireEvent.keyDown(
          currentElement(),
          {
            key,
            keyCode,
            which: keyCode,
            ...eventOverrides,
          },
        )

        if (keyPressDefaultNotPrevented) {
          await fireInputEventIfNeeded({
            ...calculateNewBackspaceValue(currentElement()),
            eventOverrides: {
              inputType: 'deleteContentBackward',
              ...eventOverrides,
            },
          })
        }

        await fireEvent.keyUp(currentElement(), {
          key,
          keyCode,
          which: keyCode,
          ...eventOverrides,
        })
      },
      '{selectall}': async () => {
        await tick()
        currentElement().setSelectionRange(0, currentValue().length)
      },
    }
    const eventCallbacks = []
    let remainingString = text
    while (remainingString) {
      const eventKey = Object.keys(eventCallbackMap).find(key =>
        remainingString.startsWith(key),
      )
      if (eventKey) {
        eventCallbacks.push(eventCallbackMap[eventKey])
        remainingString = remainingString.slice(eventKey.length)
      } else {
        const character = remainingString[0]
        eventCallbacks.push((...args) => typeCharacter(character, ...args))
        remainingString = remainingString.slice(1)
      }
    }
    const eventOverrides = {}
    let prevWasMinus, prevWasPeriod
    for (const callback of eventCallbacks) {
      if (delay > 0) await wait(delay)
      if (!currentElement().disabled) {
        const returnValue = await callback({
          prevWasMinus,
          prevWasPeriod,
          eventOverrides,
        })
        Object.assign(eventOverrides, returnValue?.eventOverrides)
        prevWasMinus = returnValue?.prevWasMinus
        prevWasPeriod = returnValue?.prevWasPeriod
      }
    }
  }

  async function fireInputEventIfNeeded({
    newValue,
    newSelectionStart,
    eventOverrides,
  }) {
    const prevValue = currentValue()
    if (!currentElement().readOnly && newValue !== prevValue) {
      await fireEvent.input(currentElement(), {
        target: {value: newValue},
        ...eventOverrides,
      })

      setSelectionRange({newValue, newSelectionStart})
    }

    return {prevValue}
  }

  async function typeCharacter(
    char,
    {prevWasMinus = false, prevWasPeriod = false, eventOverrides},
  ) {
    const key = char // TODO: check if this also valid for characters with diacritic markers e.g. úé etc
    const keyCode = char.charCodeAt(0)
    let nextPrevWasMinus, nextPrevWasPeriod

    const keyDownDefaultNotPrevented = await fireEvent.keyDown(
      currentElement(),
      {
        key,
        keyCode,
        which: keyCode,
        ...eventOverrides,
      },
    )

    if (keyDownDefaultNotPrevented) {
      const keyPressDefaultNotPrevented = await fireEvent.keyPress(
        currentElement(),
        {
          key,
          keyCode,
          charCode: keyCode,
          ...eventOverrides,
        },
      )

      if (keyPressDefaultNotPrevented) {
        let newEntry = char
        if (prevWasMinus) {
          newEntry = `-${char}`
        } else if (prevWasPeriod) {
          newEntry = `.${char}`
        }

        const {prevValue} = await fireInputEventIfNeeded({
          ...calculateNewValue(newEntry, currentElement()),
          eventOverrides: {
            data: key,
            inputType: 'insertText',
            ...eventOverrides,
          },
        })

        // typing "-" into a number input will not actually update the value
        // so for the next character we type, the value should be set to
        // `-${newEntry}`
        // we also preserve the prevWasMinus when the value is unchanged due
        // to typing an invalid character (typing "-a3" results in "-3")
        if (currentElement().type === 'number') {
          const newValue = currentValue()
          if (newValue === prevValue && newEntry !== '-') {
            nextPrevWasMinus = prevWasMinus
          } else {
            nextPrevWasMinus = newEntry === '-'
          }
          if (newValue === prevValue && newEntry !== '.') {
            nextPrevWasPeriod = prevWasPeriod
          } else {
            nextPrevWasPeriod = newEntry === '.'
          }
        }
      }
    }

    await fireEvent.keyUp(currentElement(), {
      key,
      keyCode,
      which: keyCode,
      ...eventOverrides,
    })

    return {prevWasMinus: nextPrevWasMinus, prevWasPeriod: nextPrevWasPeriod}
  }

  function modifier({name, key, keyCode, modifierProperty}) {
    return {
      [`{${name}}`]: async ({eventOverrides}) => {
        const newEventOverrides = {[modifierProperty]: true}

        await fireEvent.keyDown(currentElement(), {
          key,
          keyCode,
          which: keyCode,
          ...eventOverrides,
          ...newEventOverrides,
        })

        return {eventOverrides: newEventOverrides}
      },
      [`{/${name}}`]: async ({eventOverrides}) => {
        const newEventOverrides = {[modifierProperty]: false}

        await fireEvent.keyUp(currentElement(), {
          key,
          keyCode,
          which: keyCode,
          ...eventOverrides,
          ...newEventOverrides,
        })

        return {eventOverrides: newEventOverrides}
      },
    }
  }
}
type = wrapAsync(type)

// yes, calculateNewBackspaceValue and calculateNewValue look extremely similar
// and you may be tempted to create a shared abstraction.
// If you, brave soul, decide to so endevor, please increment this count
// when you inevitably fail: 1
function calculateNewBackspaceValue(element) {
  const {selectionStart, selectionEnd, value} = element
  let newValue, newSelectionStart

  if (selectionStart === null) {
    // at the end of an input type that does not support selection ranges
    // https://github.com/testing-library/user-event/issues/316#issuecomment-639744793
    newValue = value.slice(0, value.length - 1)
    newSelectionStart = selectionStart - 1
  } else if (selectionStart === selectionEnd) {
    if (selectionStart === 0) {
      // at the beginning of the input
      newValue = value
      newSelectionStart = selectionStart
    } else if (selectionStart === value.length) {
      // at the end of the input
      newValue = value.slice(0, value.length - 1)
      newSelectionStart = selectionStart - 1
    } else {
      // in the middle of the input
      newValue = value.slice(0, selectionStart - 1) + value.slice(selectionEnd)
      newSelectionStart = selectionStart - 1
    }
  } else {
    // we have something selected
    const firstPart = value.slice(0, selectionStart)
    newValue = firstPart + value.slice(selectionEnd)
    newSelectionStart = firstPart.length
  }

  return {newValue, newSelectionStart}
}

function calculateNewDeleteValue(element) {
  const {selectionStart, selectionEnd, value} = element
  let newValue

  if (selectionStart === null) {
    // at the end of an input type that does not support selection ranges
    // https://github.com/testing-library/user-event/issues/316#issuecomment-639744793
    newValue = value
  } else if (selectionStart === selectionEnd) {
    if (selectionStart === 0) {
      // at the beginning of the input
      newValue = value.slice(1)
    } else if (selectionStart === value.length) {
      // at the end of the input
      newValue = value
    } else {
      // in the middle of the input
      newValue = value.slice(0, selectionStart) + value.slice(selectionEnd + 1)
    }
  } else {
    // we have something selected
    const firstPart = value.slice(0, selectionStart)
    newValue = firstPart + value.slice(selectionEnd)
  }

  return {newValue, newSelectionStart: selectionStart}
}

function calculateNewValue(newEntry, element) {
  const {selectionStart, selectionEnd, value} = element
  // can't use .maxLength property because of a jsdom bug:
  // https://github.com/jsdom/jsdom/issues/2927
  const maxLength = Number(element.getAttribute('maxlength') ?? -1)
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

export {type}

/*
eslint
  no-loop-func: "off",
  max-lines-per-function: "off",
*/

import {wrapAsync} from '../wrap-async'
import {createEvent} from '../events'
import {getConfig} from '../config'
import {fireEvent} from './utils'
import {click} from './click'
import {focus} from './focus'

async function selectOption(select, option, init) {
  option.selected = true
  await fireEvent(select, createEvent('input', select, init))
  await fireEvent(select, createEvent('change', select, init))
}

async function selectOptionInMultiple(select, options, init) {
  for (const option of options) {
    // events fired for multiple select are weird. Can't use hover...
    await fireEvent.pointerOver(option, init)
    await fireEvent.pointerEnter(select, init)
    await fireEvent.mouseOver(option)
    await fireEvent.mouseEnter(select)
    await fireEvent.pointerMove(option, init)
    await fireEvent.mouseMove(option, init)
    await fireEvent.pointerDown(option, init)
    await fireEvent.mouseDown(option, init)
    await focus(select, init)
    await fireEvent.pointerUp(option, init)
    await fireEvent.mouseUp(option, init)
    await selectOption(select, option, init)
    await fireEvent.click(option, init)
  }
}

async function selectOptionInSingle(select, option, init) {
  await click(select, init)
  await selectOption(select, option, init)
}

async function selectOptions(element, values, init) {
  const valArray = Array.isArray(values) ? values : [values]
  const allOptions = Array.from(element.querySelectorAll('option'))
  const selectedOptions = valArray.map(val => {
    if (allOptions.includes(val)) {
      return val
    } else {
      const matchingOption = allOptions.find(o => o.value === val)
      if (matchingOption) {
        return matchingOption
      } else {
        throw getConfig().getElementError(
          `Value "${val}" not found in options`,
          element,
        )
      }
    }
  })

  if (element.multiple) {
    await selectOptionInMultiple(element, selectedOptions, init)
  } else if (selectedOptions.length === 1) {
    await selectOptionInSingle(element, selectedOptions[0], init)
  } else {
    throw getConfig().getElementError(
      `Cannot select multiple options on a non-multiple select`,
      element,
    )
  }
}
selectOptions = wrapAsync(selectOptions)

export {selectOptions}

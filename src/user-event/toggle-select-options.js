import {getConfig} from '../config'
import {wrapAsync} from '../wrap-async'
import {fireEvent, getMouseEventOptions} from './utils'
import {clickElement} from './click'

async function toggleSelectOption(select, option, init) {
  await fireEvent.mouseOver(option, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(option, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(option, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(option)
  await fireEvent.mouseUp(option, getMouseEventOptions('mouseup', init))
  await fireEvent.click(option, getMouseEventOptions('click', init, 1))

  option.selected = !option.selected

  await fireEvent.change(select)
}

async function toggleSelectOptions(element, values, init) {
  if (!element || element.tagName !== 'SELECT' || !element.multiple) {
    throw getConfig().getElementError(
      `Unable to toggleSelectOptions - must be a multiple select`,
      element,
    )
  }

  await clickElement(element, init)

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

  for (const option of selectedOptions) {
    await toggleSelectOption(element, option, init)
  }
}
toggleSelectOptions = wrapAsync(toggleSelectOptions)

export {toggleSelectOptions}

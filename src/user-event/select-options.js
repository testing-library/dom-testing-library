import {wrapAsync} from '../wrap-async'
import {getConfig} from '../config'
import {fireEvent, getMouseEventOptions} from './utils'
import {clickElement} from './click'

async function selectOption(select, option, init) {
  await fireEvent.mouseOver(option, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(option, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(option, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(option)
  await fireEvent.mouseUp(option, getMouseEventOptions('mouseup', init))
  await fireEvent.click(option, getMouseEventOptions('click', init, 1))

  option.selected = true

  await fireEvent.change(select)
}

async function selectOptions(element, values, init) {
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

  if (element.multiple) {
    for (const option of selectedOptions) {
      await selectOption(element, option)
    }
  } else {
    if (selectedOptions.length !== 1) {
      throw getConfig().getElementError(
        `Cannot select multiple options on a non-multiple select`,
        element,
      )
    }
    await selectOption(element, selectedOptions[0])
  }
}
selectOptions = wrapAsync(selectOptions)

export {selectOptions}

import {userEvent} from '../../'
import {setup} from './helpers/utils'

test('hover', async () => {
  const {element, getEventSnapshot} = setup('<button />')

  await userEvent.hover(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointerover
    button - pointerenter
    button - mouseover: Left (0)
    button - mouseenter: Left (0)
    button - pointermove
    button - mousemove: Left (0)
  `)
})

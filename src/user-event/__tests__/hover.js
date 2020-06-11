import * as userEvent from '..'
import {setup} from './helpers/utils'

test('hover', async () => {
  const {element, getEventCalls} = setup('<button />')

  await userEvent.hover(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointerover
    button - pointerenter
    button - mouseover: Left (0)
    button - mouseenter: Left (0)
    button - pointermove
    button - mousemove: Left (0)
  `)
})

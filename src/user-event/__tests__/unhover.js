import * as userEvent from '..'
import {setup} from './helpers/utils'

test('unhover', async () => {
  const {element, getEventSnapshot} = setup('<button />')

  await userEvent.unhover(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointermove
    button - mousemove: Left (0)
    button - pointerout
    button - pointerleave
    button - mouseout: Left (0)
    button - mouseleave: Left (0)
  `)
})

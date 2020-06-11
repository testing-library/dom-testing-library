import userEvent from '..'
import {setup} from './helpers/utils'

test('unhover', async () => {
  const {element, getEventCalls} = setup('<button />')

  await userEvent.unhover(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button

    mousemove: Left (0)
    mouseleave: Left (0)
  `)
})

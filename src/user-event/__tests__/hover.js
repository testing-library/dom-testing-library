import userEvent from '..'
import {setup} from './helpers/utils'

test('hover', async () => {
  const {element, getEventCalls} = setup('<button />')

  await userEvent.hover(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button

    mouseover: Left (0)
    mouseenter: Left (0)
    mousemove: Left (0)
  `)
})

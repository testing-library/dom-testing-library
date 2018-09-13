import 'jest-dom/extend-expect'
import {waitFor} from '../'
import {render} from './helpers/test-utils'

test('findBy* queries poll for element', async () => {
  const {container, findByTestId} = render(
    `<div data-testid="initial-id"></div>`,
  )

  setTimeout(() => {
    container.firstChild.setAttribute('data-testid', 'final-id')
  }, 50)

  const element = await findByTestId(/final/)
  expect(element).not.toBeNull()
  expect(element).toMatchInlineSnapshot(`
<div
  data-testid="final-id"
/>
`)
})

test('it throws if timeout is exceeded', async () => {
  expect.assertions(3)

  const timeout = 50

  const {findByText} = render(`<div>The text</div>`)

  await expect(findByText('Not the text', {timeout})).rejects.toBeDefined()

  await expect(findByText(/Not the/, {timeout})).rejects.toMatchInlineSnapshot(`
[Error: Unable to find an element with the text: /Not the/. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

[36m<div>[39m
  [36m<div>[39m
    [0mThe text[0m
  [36m</div>[39m
[36m</div>[39m]
`)

  try {
    await findByText('not-there', {timeout})
  } catch (err) {
    expect(err).toMatchInlineSnapshot(`
[Error: Unable to find an element with the text: not-there. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

[36m<div>[39m
  [36m<div>[39m
    [0mThe text[0m
  [36m</div>[39m
[36m</div>[39m]
`)
  }
})

test('takes timeout as an option from last argument', async () => {
  const {container, findByTestId} = render(
    `<div data-testid="initial-id"></div>`,
  )

  const timeout = 50

  setTimeout(() => {
    container.firstChild.setAttribute('data-testid', 'final-id')
  }, timeout * 2)

  await expect(findByTestId('final-id', {timeout})).rejects.toBeDefined()
})

test('calling waitFor with additional arguments invokes function', async () => {
  const {container, getByTestId} = render(
    `<div data-testid="initial-id"></div>`,
  )

  setTimeout(() => {
    container.firstChild.setAttribute('data-testid', 'final-id')
  }, 50)

  const el = await waitFor(getByTestId, 'final-id')

  expect(container.firstChild).toBe(el)
})

test('waitFor on a function that returns null times out', async () => {
  // the main way to keep polling is to throw an error, but returning null works too
  const {container, queryByTestId} = render(
    `<div data-testid="initial-id"></div>`,
  )

  const timeout = 50

  setTimeout(() => {
    container.firstChild.setAttribute('data-testid', 'final-id')
  }, timeout * 2)

  await expect(
    waitFor(queryByTestId, 'final-id', {timeout}),
  ).rejects.toBeDefined()
})

import jestSnapshotSerializerAnsi from 'jest-snapshot-serializer-ansi'
import {screen} from '..'
import {render, renderIntoDocument} from './helpers/test-utils'

expect.addSnapshotSerializer(jestSnapshotSerializerAnsi)

// Since screen.debug internally calls getUserCodeFrame, we mock it so it doesn't affect these tests
jest.mock('../get-user-code-frame', () => ({
  getUserCodeFrame: () => '',
}))

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
})

test('exposes queries that are attached to document.body', async () => {
  renderIntoDocument(`<div>hello world</div>`)
  screen.getByText(/hello world/i)
  await screen.findByText(/hello world/i)
  expect(screen.queryByText(/hello world/i)).not.toBeNull()
})

test('logs Playground URL that are attached to document.body', () => {
  renderIntoDocument(`<div>hello world</div>`)
  screen.logTestingPlaygroundURL()
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
    Open this URL in your browser

    https://testing-playground.com/#markup=DwEwlgbgfAFgpgGwQewAQHdkCcEmAenGiA
  `)
})

test('logs messsage when element is empty', () => {
  screen.logTestingPlaygroundURL(document.createElement('div'))
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(
    `The provided element doesn't have any children.`,
  )
})

test('logs messsage when element is not a valid HTML', () => {
  screen.logTestingPlaygroundURL(null)
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(
    `The element you're providing isn't a valid DOM element.`,
  )
  console.log.mockClear()
  screen.logTestingPlaygroundURL({})
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(
    `The element you're providing isn't a valid DOM element.`,
  )
})

test('logs Playground URL that are passed as element', () => {
  screen.logTestingPlaygroundURL(render(`<h1>Sign <em>up</em></h1>`).container)
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
    Open this URL in your browser

    https://testing-playground.com/#markup=DwCwjAfAyglg5gOwATAKYFsIFcAOwD0GEB4EQA
  `)
})

test('returns Playground URL that are passed as element', () => {
  const playGroundUrl = screen.logTestingPlaygroundURL(
    render(`<h1>Sign <em>up</em></h1>`).container,
  )
  expect(playGroundUrl).toMatchInlineSnapshot(
    'https://testing-playground.com/#markup=DwCwjAfAyglg5gOwATAKYFsIFcAOwD0GEB4EQA',
  )
})

test('exposes debug method', () => {
  renderIntoDocument(
    `<button>test</button><span>multi-test</span><div>multi-test</div>`,
  )
  // log document
  screen.debug()
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
<body>
  <button>
    test
  </button>
  <span>
    multi-test
  </span>
  <div>
    multi-test
  </div>
</body>
`)
  console.log.mockClear()
  // log single element
  screen.debug(screen.getByText('test', {selector: 'button'}))
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
<button>
  test
</button>
`)
  console.log.mockClear()
  // log multiple elements
  screen.debug(screen.getAllByText('multi-test'))
  expect(console.log).toHaveBeenCalledTimes(2)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
<span>
  multi-test
</span>
`)
  expect(console.log.mock.calls[1][0]).toMatchInlineSnapshot(`
<div>
  multi-test
</div>
`)
  console.log.mockClear()
})

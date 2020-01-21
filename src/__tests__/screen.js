import {renderIntoDocument} from './helpers/test-utils'
import {screen} from '..'

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

test('exposes debug method', () => {
  renderIntoDocument(
    `<button>test</button><span>multi-test</span><div>multi-test</div>`,
  )
  expect(screen.debug).toBeInstanceOf(Function)
  // log document
  screen.debug()
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
    "<body>
      <button>
        test
      </button>
      <span>
        multi-test
      </span>
      <div>
        multi-test
      </div>
    </body>"
  `)
  // log single element
  screen.debug(screen.getByText('test', {selector: 'button'}))
  expect(console.log).toHaveBeenCalledTimes(2)
  expect(console.log.mock.calls[1][0]).toMatchInlineSnapshot(`
    "<button>
      test
    </button>"
  `)
  // log multiple elements
  screen.debug(screen.getAllByText('multi-test'))
  expect(console.log).toHaveBeenCalledTimes(4)
  expect(console.log.mock.calls[2][0]).toMatchInlineSnapshot(`
    "<span>
      multi-test
    </span>"
  `)
  expect(console.log.mock.calls[3][0]).toMatchInlineSnapshot(`
    "<div>
      multi-test
    </div>"
  `)
})

/* eslint no-console:0 */

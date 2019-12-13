import {renderIntoDocument} from './helpers/test-utils'
import {screen} from '..'

test('exposes queries that are attached to document.body', async () => {
  renderIntoDocument(`<div>hello world</div>`)
  screen.getByText(/hello world/i)
  await screen.findByText(/hello world/i)
  expect(screen.queryByText(/hello world/i)).not.toBeNull()
})

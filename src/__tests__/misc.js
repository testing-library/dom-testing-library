import {render} from './helpers/test-utils'
import {queryByAttribute} from '..'

// we used to use queryByAttribute internally, but we don't anymore. Some people
// use it as an undocumented part of the API, so we'll keep it around.
test('queryByAttribute', () => {
  const {container} = render(
    '<div data-foo="bar"></div><div data-foo="rubar"></div>',
  )
  expect(queryByAttribute('data-foo', container, 'bar')).not.toBeNull()
  expect(queryByAttribute('blah', container, 'sup')).toBeNull()
  expect(() => queryByAttribute('data-foo', container, /bar/)).toThrow(
    /multiple/,
  )
})

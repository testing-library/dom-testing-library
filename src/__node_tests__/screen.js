import {screen} from '..'

test('the screen export throws a helpful error message when no global document is accessible', () => {
  expect(() =>
    screen.getByText(/hello world/i),
  ).toThrowErrorMatchingInlineSnapshot(
    `"For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error"`,
  )
})

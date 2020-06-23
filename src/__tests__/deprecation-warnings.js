import {waitForElement, waitForDomChange, wait} from '..'

afterEach(() => {
  console.warn.mockClear()
})

test('deprecation warnings only warn once', async () => {
  await wait(() => {}, {timeout: 1})
  await waitForElement(() => {}, {timeout: 1}).catch(e => e)
  await waitForDomChange({timeout: 1}).catch(e => e)
  expect(console.warn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "\`wait\` has been deprecated and replaced by \`waitFor\` instead. In most cases you should be able to find/replace \`wait\` with \`waitFor\`. Learn more: https://testing-library.com/docs/dom-testing-library/api-async#waitfor.",
      ],
      Array [
        "\`waitForElement\` has been deprecated. Use a \`find*\` query (preferred: https://testing-library.com/docs/dom-testing-library/api-queries#findby) or use \`waitFor\` instead: https://testing-library.com/docs/dom-testing-library/api-async#waitfor",
      ],
      Array [
        "\`waitForDomChange\` has been deprecated. Use \`waitFor\` instead: https://testing-library.com/docs/dom-testing-library/api-async#waitfor.",
      ],
    ]
  `)

  console.warn.mockClear()
  await wait(() => {}, {timeout: 1})
  await waitForElement(() => {}, {timeout: 1}).catch(e => e)
  await waitForDomChange({timeout: 1}).catch(e => e)
  expect(console.warn).not.toHaveBeenCalled()
})

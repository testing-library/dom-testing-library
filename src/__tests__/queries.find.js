import {render} from './helpers/test-utils'

test('find asynchronously finds elements', async () => {
  const {
    findByLabelText,
    findAllByLabelText,

    findByPlaceholderText,
    findAllByPlaceholderText,

    findByText,
    findAllByText,

    findByAltText,
    findAllByAltText,

    findByTitle,
    findAllByTitle,

    findByDisplayValue,
    findAllByDisplayValue,

    findByRole,
    findAllByRole,

    findByTestId,
    findAllByTestId,
  } = render(`
    <div>
      <div data-testid="test-id" aria-label="test-label">test text content</div>
      <select><option>display value</option></select>
      <input placeholder="placeholder" />
      <img alt="test alt text" src="/lucy-ricardo.png" />
      <div alt="test alt text" />
      <span title="test title" />
      <div role="dialog"></div>
      <div role="meter progressbar"></div>
      <header>header</header>
      <input type="hidden" />
    </div>
  `)
  await expect(findByLabelText('test-label')).resolves.toBeTruthy()
  await expect(findAllByLabelText('test-label')).resolves.toHaveLength(1)

  await expect(findByPlaceholderText('placeholder')).resolves.toBeTruthy()
  await expect(findAllByPlaceholderText('placeholder')).resolves.toHaveLength(1)

  await expect(findByText('test text content')).resolves.toBeTruthy()
  await expect(findAllByText('test text content')).resolves.toHaveLength(1)

  await expect(findByAltText('test alt text')).resolves.toBeTruthy()
  await expect(findAllByAltText('test alt text')).resolves.toHaveLength(1)

  await expect(findByTitle('test title')).resolves.toBeTruthy()
  await expect(findAllByTitle('test title')).resolves.toHaveLength(1)

  await expect(findByDisplayValue('display value')).resolves.toBeTruthy()
  await expect(findAllByDisplayValue('display value')).resolves.toHaveLength(1)

  await expect(findByRole('dialog')).resolves.toBeTruthy()
  await expect(findAllByRole('dialog')).resolves.toHaveLength(1)

  await expect(findByRole('meter')).resolves.toBeTruthy()
  await expect(findAllByRole('meter')).resolves.toHaveLength(1)
  await expect(
    findByRole('progressbar', {queryFallbacks: true}),
  ).resolves.toBeTruthy()
  await expect(
    findAllByRole('progressbar', {queryFallbacks: true}),
  ).resolves.toHaveLength(1)

  await expect(findByRole('banner')).resolves.toBeTruthy()
  await expect(findAllByRole('banner')).resolves.toHaveLength(1)

  await expect(findByTestId('test-id')).resolves.toBeTruthy()
  await expect(findAllByTestId('test-id')).resolves.toHaveLength(1)
})

test('find rejects when something cannot be found', async () => {
  const {
    findByLabelText,
    findAllByLabelText,

    findByPlaceholderText,
    findAllByPlaceholderText,

    findByText,
    findAllByText,

    findByAltText,
    findAllByAltText,

    findByTitle,
    findAllByTitle,

    findByDisplayValue,
    findAllByDisplayValue,

    findByRole,
    findAllByRole,

    findByTestId,
    findAllByTestId,
  } = render(`<div />`)

  // I just don't want multiple lines for these.
  // qo = queryOptions
  // wo = waitForElementOptions
  const qo = {} // query options
  const wo = {timeout: 10} // wait options

  await expect(findByLabelText('x', qo, wo)).rejects.toThrow('x')
  await expect(findAllByLabelText('x', qo, wo)).rejects.toThrow('x')

  await expect(findByPlaceholderText('x', qo, wo)).rejects.toThrow('x')
  await expect(findAllByPlaceholderText('x', qo, wo)).rejects.toThrow('x')

  await expect(findByText('x', qo, wo)).rejects.toThrow('x')
  await expect(findAllByText('x', qo, wo)).rejects.toThrow('x')

  await expect(findByAltText('x', qo, wo)).rejects.toThrow('x')
  await expect(findAllByAltText('x', qo, wo)).rejects.toThrow('x')

  await expect(findByTitle('x', qo, wo)).rejects.toThrow('x')
  await expect(findAllByTitle('x', qo, wo)).rejects.toThrow('x')

  await expect(findByDisplayValue('x', qo, wo)).rejects.toThrow('x')
  await expect(findAllByDisplayValue('x', qo, wo)).rejects.toThrow('x')

  await expect(findByRole('x', qo, wo)).rejects.toThrow('x')
  await expect(findAllByRole('x', qo, wo)).rejects.toThrow('x')

  await expect(findByTestId('x', qo, wo)).rejects.toThrow('x')
  await expect(findAllByTestId('x', qo, wo)).rejects.toThrow('x')
})

test('actually works with async code', async () => {
  const {findByTestId, container, rerender} = render(`<div />`)
  setTimeout(() => rerender(`<div data-testid="div">correct dom</div>`), 20)
  await expect(findByTestId('div', {}, {container})).resolves.toBeTruthy()
})

import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '..'
import {setup} from './helpers/utils'
import './helpers/customElement'

test('should paste text', async () => {
  const {element, getEventCalls} = setup(<input />)
  await userEvent.paste(element, 'Sup')
  expect(getEventCalls()).toMatchInlineSnapshot(`
    focus
    input: "{CURSOR}" -> "Sup"
  `)
})

test('does not paste when readOnly', () => {
  const handleChange = jest.fn()
  render(<input data-testid="input" readOnly onChange={handleChange} />)
  userEvent.paste(screen.getByTestId('input'), 'hi')
  expect(handleChange).not.toHaveBeenCalled()
})

test('does not paste when disabled', () => {
  const handleChange = jest.fn()
  render(<input data-testid="input" disabled onChange={handleChange} />)
  userEvent.paste(screen.getByTestId('input'), 'hi')
  expect(handleChange).not.toHaveBeenCalled()
})

test.each(['input', 'textarea'])('should paste text in <%s>', type => {
  const onChange = jest.fn()
  render(
    React.createElement(type, {
      'data-testid': 'input',
      onChange,
    }),
  )
  const text = 'Hello, world!'
  userEvent.paste(screen.getByTestId('input'), text)

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(screen.getByTestId('input')).toHaveProperty('value', text)
})

test.each(['input', 'textarea'])(
  'should paste text in <%s> up to maxLength if provided',
  async type => {
    const onChange = jest.fn()
    const onKeyDown = jest.fn()
    const onKeyPress = jest.fn()
    const onKeyUp = jest.fn()
    const maxLength = 10

    render(
      React.createElement(type, {
        'data-testid': 'input',
        onChange,
        onKeyDown,
        onKeyPress,
        onKeyUp,
        maxLength,
      }),
    )

    const text = 'superlongtext'
    const slicedText = text.slice(0, maxLength)

    const inputEl = screen.getByTestId('input')

    await userEvent.type(inputEl, text)

    expect(inputEl).toHaveProperty('value', slicedText)
    expect(onChange).toHaveBeenCalledTimes(slicedText.length)
    expect(onKeyPress).toHaveBeenCalledTimes(text.length)
    expect(onKeyDown).toHaveBeenCalledTimes(text.length)
    expect(onKeyUp).toHaveBeenCalledTimes(text.length)

    inputEl.value = ''
    onChange.mockClear()
    onKeyPress.mockClear()
    onKeyDown.mockClear()
    onKeyUp.mockClear()

    userEvent.paste(inputEl, text)

    expect(inputEl).toHaveProperty('value', slicedText)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onKeyPress).not.toHaveBeenCalled()
    expect(onKeyDown).not.toHaveBeenCalled()
    expect(onKeyUp).not.toHaveBeenCalled()
  },
)

test.each(['input', 'textarea'])(
  'should append text in <%s> up to maxLength if provided',
  async type => {
    const onChange = jest.fn()
    const onKeyDown = jest.fn()
    const onKeyPress = jest.fn()
    const onKeyUp = jest.fn()
    const maxLength = 10

    render(
      React.createElement(type, {
        'data-testid': 'input',
        onChange,
        onKeyDown,
        onKeyPress,
        onKeyUp,
        maxLength,
      }),
    )

    const text1 = 'superlong'
    const text2 = 'text'
    const text = text1 + text2
    const slicedText = text.slice(0, maxLength)

    const inputEl = screen.getByTestId('input')

    await userEvent.type(inputEl, text1)
    await userEvent.type(inputEl, text2)

    expect(inputEl).toHaveProperty('value', slicedText)
    expect(onChange).toHaveBeenCalledTimes(slicedText.length)
    expect(onKeyPress).toHaveBeenCalledTimes(text.length)
    expect(onKeyDown).toHaveBeenCalledTimes(text.length)
    expect(onKeyUp).toHaveBeenCalledTimes(text.length)

    inputEl.value = ''
    onChange.mockClear()
    onKeyPress.mockClear()
    onKeyDown.mockClear()
    onKeyUp.mockClear()

    userEvent.paste(inputEl, text)

    expect(inputEl).toHaveProperty('value', slicedText)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onKeyPress).not.toHaveBeenCalled()
    expect(onKeyDown).not.toHaveBeenCalled()
    expect(onKeyUp).not.toHaveBeenCalled()
  },
)

test('should replace selected text all at once', async () => {
  const onChange = jest.fn()
  const {
    container: {firstChild: input},
  } = render(<input defaultValue="hello world" onChange={onChange} />)
  const selectionStart = 'hello world'.search('world')
  const selectionEnd = selectionStart + 'world'.length
  input.setSelectionRange(selectionStart, selectionEnd)
  await userEvent.paste(input, 'friend')
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(input).toHaveValue('hello friend')
})

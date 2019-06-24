import jestSerializerAnsi from 'jest-serializer-ansi'
import {getRoles, logRoles, getImplicitAriaRoles} from '../role-helpers'
import {render, cleanup} from './helpers/test-utils'

afterEach(cleanup)

function setup() {
  const {getByTestId} = render(`
<section data-testid='a-section'>
  <nav data-testid='a-nav' />
  
  <h1 data-testid='a-h1'>Main Heading</h1>
  <h2 data-testid='a-h2'>Sub Heading</h2>
  <h3 data-testid='a-h3'>Tertiary Heading</h3>

  <article data-testid='a-article'>
    <!-- menuitem is currently deprecated, but is the only 
         tag currently that aria-query returns multiple roles for
         (roles: command, menuitem).
         It's used here in case a future tag also has multiple 
         roles -->
    <menuitem data-testid='a-menuitem-1'>1</menuitem> 
    <menuitem data-testid='a-menuitem-2'>2</menuitem>

    <ul data-testid='a-list'>
      <li data-testid='a-list-item-1'>Item 1</li>
      <li data-testid='a-list-item-2'>Item 2</li>
    </ul>

    <table data-testid='a-table'>
      <tbody data-testid='a-tbody'>
        <tr data-testid='a-row'>
          <td data-testid='a-cell-1'>Cell 1</td>
          <td data-testid='a-cell-2'>Cell 2</td>
          <td data-testid='a-cell-3'>Cell 3</td>
        </tr>
      </tbody>
    </table>

    <form data-testid='a-form'>
      <input type='radio' data-testid='a-radio-1' />
      <input type='radio' data-testid='a-radio-2' />
      <input type='text' data-testid='a-input-1' />
      <input type='text' data-testid='a-input-2' />
      <textarea data-testid='a-textarea'></textarea>
    </form>

    <ul data-testid='b-list'>
      <li data-testid='b-list-item-1'>Item 1</li>
      <li data-testid='b-list-item-2'>Item 2</li>
    </ul>
   </article>
</section>
  `)

  return {
    section: getByTestId('a-section'),
    h1: getByTestId('a-h1'),
    h2: getByTestId('a-h2'),
    h3: getByTestId('a-h3'),
    nav: getByTestId('a-nav'),
    article: getByTestId('a-article'),
    menuItem: getByTestId('a-menuitem-1'),
    menuItem2: getByTestId('a-menuitem-2'),
    aUl: getByTestId('a-list'),
    aLi1: getByTestId('a-list-item-1'),
    aLi2: getByTestId('a-list-item-2'),
    bUl: getByTestId('b-list'),
    bLi1: getByTestId('b-list-item-1'),
    bLi2: getByTestId('b-list-item-2'),
    table: getByTestId('a-table'),
    tbody: getByTestId('a-tbody'),
    tr: getByTestId('a-row'),
    td1: getByTestId('a-cell-1'),
    td2: getByTestId('a-cell-2'),
    td3: getByTestId('a-cell-3'),
    form: getByTestId('a-form'),
    radio: getByTestId('a-radio-1'),
    radio2: getByTestId('a-radio-2'),
    input: getByTestId('a-input-1'),
    input2: getByTestId('a-input-2'),
    textarea: getByTestId('a-textarea'),
  }
}

test('getRoles returns expected roles for various dom nodes', () => {
  const {
    section,
    h1,
    h2,
    h3,
    nav,
    article,
    menuItem,
    menuItem2,
    aUl,
    aLi1,
    aLi2,
    bUl,
    bLi1,
    bLi2,
    table,
    tbody,
    tr,
    td1,
    td2,
    td3,
    form,
    radio,
    radio2,
    input,
    input2,
    textarea,
  } = setup()

  expect(getRoles(section)).toEqual({
    region: [section],
    heading: [h1, h2, h3],
    navigation: [nav],
    radio: [radio, radio2],
    article: [article],
    list: [aUl, bUl],
    listitem: [aLi1, aLi2, bLi1, bLi2],
    table: [table],
    row: [tr],
    cell: [td1, td2, td3],
    form: [form],
    textbox: [input, input2, textarea],
    rowgroup: [tbody],
    command: [menuItem, menuItem2],
    menuitem: [menuItem, menuItem2],
  })
})

test('logRoles logs expected roles for various dom nodes', () => {
  expect.addSnapshotSerializer(jestSerializerAnsi)

  const {section} = setup()
  const output = logRoles(section)

  expect(output).toMatchSnapshot()
})

test('getImplicitAriaRoles returns expected roles for various dom nodes', () => {
  const {section, h1, form, radio, input} = setup()

  expect(getImplicitAriaRoles(section)).toEqual(['region'])
  expect(getImplicitAriaRoles(h1)).toEqual(['heading'])
  expect(getImplicitAriaRoles(form)).toEqual(['form'])
  expect(getImplicitAriaRoles(radio)).toEqual(['radio'])
  expect(getImplicitAriaRoles(input)).toEqual(['textbox'])
})

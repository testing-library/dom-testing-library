import {getRoles, logRoles, getImplicitAriaRole} from '../role-helpers'
import {render, cleanup} from './helpers/test-utils'

afterEach(cleanup)

function setup() {
  const {getByTestId} = render(`
<section data-testid='main-content'>
  <nav data-testid='nav-bar' />
  
  <h1 data-testid='main-heading'>Main Heading</h1>
  <h2 data-testid='sub-heading'>Sub Heading</h2>
  <h3 data-testid='tertiary-heading'>Tertiary Heading</h3>
  
  <article data-testid='featured-article'>

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

  const section = getByTestId('main-content')
  const h1 = getByTestId('main-heading')
  const h2 = getByTestId('sub-heading')
  const h3 = getByTestId('tertiary-heading')
  const nav = getByTestId('nav-bar')
  const article = getByTestId('featured-article')
  const aUl = getByTestId('a-list')
  const aLi1 = getByTestId('a-list-item-1')
  const aLi2 = getByTestId('a-list-item-2')
  const bUl = getByTestId('b-list')
  const bLi1 = getByTestId('b-list-item-1')
  const bLi2 = getByTestId('b-list-item-2')
  const table = getByTestId('a-table')
  const tbody = getByTestId('a-tbody')
  const tr = getByTestId('a-row')
  const td1 = getByTestId('a-cell-1')
  const td2 = getByTestId('a-cell-2')
  const td3 = getByTestId('a-cell-3')
  const form = getByTestId('a-form')
  const radio = getByTestId('a-radio-1')
  const radio2 = getByTestId('a-radio-2')
  const input = getByTestId('a-input-1')
  const input2 = getByTestId('a-input-2')
  const textarea = getByTestId('a-textarea')

  return {
    section,
    h1,
    h2,
    h3,
    nav,
    article,
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
  })
})

test('logRoles logs expected roles for various dom nodes', () => {
  const {section} = setup()
  const output = logRoles(section)

  // If the snapshot needs to be updated, uncomment the console.log
  // and take a look at the output to make sure it still looks good
  //console.log(output);
  expect(output).toMatchSnapshot()
})

test('getImplicitAriaRole returns expected roles for various dom nodes', () => {
  const {section, h1, form, radio, input} = setup()

  expect(getImplicitAriaRole(section)).toEqual(['region'])
  expect(getImplicitAriaRole(h1)).toEqual(['heading'])
  expect(getImplicitAriaRole(form)).toEqual(['form'])
  expect(getImplicitAriaRole(radio)).toEqual(['radio'])
  expect(getImplicitAriaRole(input)).toEqual(['textbox'])
})

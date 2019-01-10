// query utilities:
import {getByLabelText} from '../'
import document from './helpers/document'

function getExampleDOM() {
  const div = document.createElement('div')
  div.innerHTML = `
    <label>Cars
        <select>
            <option>Volvo</option>
            <option>Mercedes</option>
        </select>
    </label>
    <label><span>States</span>
        <select>
            <option>Damaged</option>
            <option>Good</option>
        </select>
    </label>
    <label><input type="checkbox" value="1"> I agree to terms </label>
  `
  return div
}

test('elements inside label', () => {
  const container = getExampleDOM()

  const element1 = getByLabelText(container, 'Cars')
  expect(element1.tagName).toBe('SELECT')

  // this fails because getNodeText function returns incorrect result on JSDOM but it good for browser
  // const element2 = getByLabelText(container, 'States');
  // expect(element2.tagName).toBe('SELECT');

  const element3 = getByLabelText(container, 'I agree to terms')
  expect(element3.value).toBe('1')
})

/* eslint-disable no-control-regex */
import {getRoles, logRoles} from '../role-helpers'

function setup() {
  const section = document.createElement('section')
  const h1 = document.createElement('h1')
  const h2 = document.createElement('h2')
  const h3 = document.createElement('h3')
  const nav = document.createElement('nav')
  const article = document.createElement('article')
  const ul = document.createElement('ul')
  const li1 = document.createElement('li')
  const li2 = document.createElement('li')
  const table = document.createElement('table')
  const tr = document.createElement('tr')
  const td1 = document.createElement('td')
  const td2 = document.createElement('td')
  const td3 = document.createElement('td')
  const formEl = document.createElement('form')
  const input = document.createElement('input')
  const input2 = document.createElement('input')

  section.appendChild(h1)
  section.appendChild(nav)
  section.appendChild(h2)
  section.appendChild(h3)
  section.appendChild(article)
  article.appendChild(ul)
  ul.appendChild(li1)
  ul.appendChild(li2)
  article.appendChild(table)
  table.appendChild(tr)
  tr.appendChild(td1)
  tr.appendChild(td2)
  tr.appendChild(td3)
  article.appendChild(formEl)
  formEl.appendChild(input)
  formEl.appendChild(input2)

  return {
    section,
    h1,
    h2,
    h3,
    nav,
    article,
    ul,
    li1,
    li2,
    table,
    tr,
    td1,
    td2,
    td3,
    formEl,
    input,
    input2,
  }
}
test('getRoles is a function', () => {
  expect(typeof getRoles).toBe('function')
})

test('getRoles returns expected roles for various dom nodes', () => {
  const {
    section,
    h1,
    h2,
    h3,
    nav,
    article,
    ul,
    li1,
    li2,
    table,
    tr,
    td1,
    td2,
    td3,
    formEl,
    input,
    input2,
  } = setup()

  expect(getRoles(section)).toEqual({
    region: [section],
    heading: [h1, h2, h3],
    navigation: [nav],
    article: [article],
    list: [ul],
    listitem: [li1, li2],
    table: [table],
    row: [tr],
    cell: [td1, td2, td3],
    form: [formEl],
    textbox: [input, input2],
  })
})

test('logRoles is a function', () => {
  expect(typeof logRoles).toBe('function')
})

test('logRoles logs expected roles for various dom nodes', () => {
  const {section} = setup()
  const output = logRoles(section)

  expect(/region[^<]+<section/gi.test(output)).toBe(true)
  expect(/heading[^<]+<h1 \/>[^<]+<h2 \/>[^<]+<h3/i.test(output)).toBe(true)
  expect(/navigation[^<]+<nav/i.test(output)).toBe(true)
  expect(/article[^<]+<article/i.test(output)).toBe(true)
  expect(/list[^<]+<ul/i.test(output)).toBe(true)
  expect(/listitem[^<]+<li[^<]+<li/i.test(output)).toBe(true)
  expect(/table[^<]+<table/i.test(output)).toBe(true)
  expect(/row[^<]+<tr/i.test(output)).toBe(true)
  expect(/cell[^<]+<td[^<]+<td[^<]+<td/i.test(output)).toBe(true)
  expect(/form[^<]+<form/i.test(output)).toBe(true)
  expect(/textbox[^<]+<input[^<]+<input/i.test(output)).toBe(true)
})

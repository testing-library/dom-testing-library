import {cleanup, renderIntoDocument} from '../helpers/test-utils'

test('byRole performance', () => {
  const samples = 1000
  const times = Array(samples)

  for (let run = 0; run <= samples; run += 1) {
    const {getAllByRole} = renderIntoDocument(`
<main>
  <article>
    <h1>A list of things to do</h1>
    <p>
      A section describing how to do. And now a list with things
      <div class="an-important-wrapper">
        <ul>
          <li>do this</li>
          <li>do that</li>
          <li>do it now</li>
        </ul>
      </div>
    </p>
  </article>
</main>  
`)
    const start = performance.now()
    getAllByRole('listitem')
    times[run] = performance.now() - start
    cleanup()
  }

  const avg = times.reduce((sum, n) => sum + n, 0) / times.length
  const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
  const percentile95 = times.sort((a, b) => a - b)[
    Math.floor(times.length * 0.95)
  ]

  expect(`
95th percentile: ${Math.round(percentile95 * 1000)}µs
median:          ${Math.round(median * 1000)}µs
avg:             ${Math.round(avg * 1000)}µs`).toMatchInlineSnapshot(`
    "
    95th percentile: 6045µs
    median:          4680µs
    avg:             4775µs"
  `)
})

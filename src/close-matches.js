import {makeNormalizer} from './matches'
import calculateLevenshteinDistance from 'leven'

const MAX_LEVENSHTEIN_DISTANCE = 4

export const getCloseMatchesByAttribute = (
  attribute,
  container,
  searchText,
  {collapseWhitespace, trim, normalizer} = {},
) => {
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  const allElements = Array.from(container.querySelectorAll(`[${attribute}]`))
  const allNormalizedValues = new Set(
    allElements.map(element =>
      matchNormalizer(element.getAttribute(attribute) || ''),
    ),
  )
  const iterator = allNormalizedValues.values()
  const lowerCaseSearch = searchText.toLowerCase()
  let lastClosestDistance = MAX_LEVENSHTEIN_DISTANCE
  let closestValues = []

  for (let normalizedText; (normalizedText = iterator.next().value); ) {
    if (
      Math.abs(normalizedText.length - searchText.length) > lastClosestDistance
    ) {
      // the distance cannot be closer than what we have already found
      // eslint-disable-next-line no-continue
      continue
    }

    const distance = calculateLevenshteinDistance(
      normalizedText.toLowerCase(),
      lowerCaseSearch,
    )

    if (distance > lastClosestDistance) {
      // eslint-disable-next-line no-continue
      continue
    }

    if (distance < lastClosestDistance) {
      lastClosestDistance = distance
      closestValues = []
    }
    closestValues.push(normalizedText)
  }
  return closestValues
}

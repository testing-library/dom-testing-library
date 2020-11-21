import {makeNormalizer} from './matches'

const initializeDpTable = (rows, columns) => {
  const dp = Array(rows + 1)
    .fill()
    .map(() => Array(columns + 1).fill())

  // fill rows
  for (let i = 0; i <= rows; i++) {
    dp[i][0] = i
  }

  // fill columns
  for (let i = 0; i <= columns; i++) {
    dp[0][i] = i
  }
  return dp
}

export const calculateLevenshteinDistance = (text1, text2) => {
  const dp = initializeDpTable(text1.length, text2.length)

  for (let row = 1; row < dp.length; row++) {
    for (let column = 1; column < dp[row].length; column++) {
      if (text1[row - 1] === text2[column - 1]) {
        dp[row][column] = dp[row - 1][column - 1]
      } else {
        dp[row][column] =
          Math.min(
            dp[row - 1][column - 1],
            dp[row][column - 1],
            dp[row - 1][column],
          ) + 1
      }
    }
  }
  return dp[text1.length][text2.length]
}

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

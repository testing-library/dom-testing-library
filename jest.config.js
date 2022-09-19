const {
  collectCoverageFrom,
  coveragePathIgnorePatterns,
  coverageThreshold,
  watchPlugins,
} = require('kcd-scripts/jest')

console.log('empty')

module.exports = {
  collectCoverageFrom,
  coveragePathIgnorePatterns: [
    ...coveragePathIgnorePatterns,
    '/__tests__/',
    '/__node_tests__/',
  ],
  coverageThreshold,
  watchPlugins: [
    ...watchPlugins,
    require.resolve('jest-watch-select-projects'),
  ],
  projects: [
    require.resolve('./tests/jest.config.dom.js'),
    require.resolve('./tests/jest.config.node.js'),
  ],
}

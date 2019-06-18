const {
  collectCoverageFrom,
  coveragePathIgnorePatterns,
  coverageThreshold,
  watchPlugins,
} = require('kcd-scripts/jest')

module.exports = {
  collectCoverageFrom,
  coveragePathIgnorePatterns,
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

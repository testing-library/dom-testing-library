const rollupConfig = require('kcd-scripts/dist/config/rollup.config')

// the exports in this library should always be named for all formats.
rollupConfig.output[0].exports = 'named'
module.exports = rollupConfig

const config = require('./builder.config')

config.afterSign = undefined
config.mac.hardenedRuntime = false
config.mac.notarize = false
config.mac.entitlements = undefined
config.mac.provisioningProfile = undefined

module.exports = config

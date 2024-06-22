require('dotenv').config()
const {notarize} = require('@electron/notarize')

exports.default = function notarizing(context) {
  const {electronPlatformName, appOutDir} = context
  if (electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename

  const options = {
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    teamId: process.env.APPLE_TEAM_ID,
  }

  return notarize(options)
}

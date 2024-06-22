/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'com.tobysuggate.gitfiend',
  win: {
    target: ['nsis'],
  },
  nsis: {
    perMachine: true,
  },
  linux: {
    target: ['appImage', 'deb', 'rpm'],
    category: 'Development',
    icon: 'build/iconset',
  },
  files: ['resources', 'build/icon.png'],
  asarUnpack: ['resources/dist/core', 'resources/dist/ask-pass'],
}

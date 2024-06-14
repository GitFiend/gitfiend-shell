const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('main', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  on: (channel, func) => {
    // Deliberately strip event as it includes `sender`
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  },
})

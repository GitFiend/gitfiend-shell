import {app, BrowserWindow, nativeTheme} from 'electron'
import {join} from 'path'
import windowStateKeeper from 'electron-window-state'
import {backgroundDark, backgroundLight} from '../constants'
import {platform} from 'os'

let mainWindow: BrowserWindow | null = null

export function runCreateWindow(port: number | null): void {
  if (!port) {
    console.error(`Couldn't create window as port was null. Exiting.`)
    app.quit()
    return
  }
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  if (app.isReady()) {
    createWindow(port).catch(e => console.log(e))
  } else {
    app.on('ready', () => createWindow(port))
  }

  app.on('window-all-closed', () => {
    app.quit()
  })
}

async function createWindow(port: number) {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800,
  })

  const dark = nativeTheme.shouldUseDarkColors

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 700,
    minHeight: 500,
    backgroundColor: dark ? backgroundDark : backgroundLight,
    autoHideMenuBar: true,
    // titleBarStyle: __MAC__ ? 'hidden' : 'default',
    titleBarStyle: 'default',
    // trafficLightPosition: {x: 20, y: 31},
    webPreferences: {
      nodeIntegration: true,
      // nodeIntegrationInWorker: true,
      v8CacheOptions: 'bypassHeatCheck',
      contextIsolation: false,
      // preload: path.join(__dirname, '..', 'resources', 'preload.js'),
    },
    icon: __DEV__ || __LIN__ ? join(__dirname, '..', 'build', 'icon.png') : undefined,
    darkTheme: dark,
  })

  let htmlPath = join(__dirname, '..', __DEV_UI__ ? 'index-dev.html' : 'index.html')
  console.log(__dirname, htmlPath)

  if (__DEV__ && __INT_TEST__) {
    htmlPath = join(__dirname, '..', 'test', 'test.html')
  }

  if (__DEV__ && !__INT_TEST__) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow
    .loadFile(htmlPath, {query: {port: port.toString(), platform: platform()}})
    .catch(console.log)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  console.log('asdfasdfasdfasdf22')

  mainWindowState.manage(mainWindow)
}

export function getMainWindow(): Electron.BrowserWindow | null {
  return mainWindow
}

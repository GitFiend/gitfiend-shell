/// <reference path="../../globals.d.ts" />
import {app, BrowserWindow, nativeTheme} from 'electron'
import path from 'path'
import windowStateKeeper from 'electron-window-state'
import {backgroundDark, backgroundLight} from '../constants'

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

  const backgroundColor = getBackgroundColor()

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 700,
    minHeight: 500,
    backgroundColor,
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
    icon: getIconPath(),
    darkTheme: nativeTheme.shouldUseDarkColors,
  })

  let htmlPath = path.join(__dirname, '..', 'index.html')
  console.log(__dirname, htmlPath)

  if (__DEV__ && __INT_TEST__) {
    htmlPath = path.join(__dirname, '..', 'test', 'test.html')
  }

  if (__DEV__ && !__INT_TEST__) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile(htmlPath, {query: {port: port.toString()}}).catch(console.log)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindowState.manage(mainWindow)
}

function getBackgroundColor(): string {
  if (nativeTheme.shouldUseDarkColors) {
    return backgroundDark
  }
  return backgroundLight
}

function getIconPath(): string | undefined {
  if (__DEV__ || __LIN__) {
    return path.join(__dirname, '..', 'build', 'icon.png')
  }
  return undefined
}

export function getMainWindow(): Electron.BrowserWindow | null {
  return mainWindow
}

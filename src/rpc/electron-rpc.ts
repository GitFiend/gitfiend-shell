import {getMainWindow} from '../main-process/main-window'
import {app, dialog, Menu, Rectangle, shell} from 'electron'
import {MenuItemOptions, RenderMenuItem} from './menus/menu-types'
import {callInRenderer} from './call-in-renderer'
import {showElectronContextMenu} from './menus/show-electron-context-menu'
import {sendThemeVarsToRenderer, setTheme} from '../main-process/theming'
import {readAppArgs} from '../main-process/command-line-args/command-line-args'
import {resolve} from 'path'
import {writeFileSync} from 'fs'

/*
We put the Electron versions in here, but they are just used for the types
when not using electron (E.g. native Mac app).
 */
export const mainFunctions = {
  closeDevTools,
  getAppArgv,
  showAboutDialog,
  show_open_folder_window,
  openExternalUrl,
  showItemInFolder,
  closeApp,
  captureRect,
  setApplicationMenu,
  showContextMenu: showElectronContextMenu,
  sendThemeVarsToRenderer,
  setTheme,
  sendMenuInfo,
  restartServer() {},
  writeFile: writeFileSync,
}

function sendMenuInfo(_recentRepos: string[], _currentRepo: string) {
  // Implementation only in native mac shell.
}

export function closeDevTools(): void {
  getMainWindow()?.webContents.closeDevTools()
}

export function getAppArgv(): {repoPath: string | null} {
  const res = readAppArgs()

  console.log({argsResult: res})

  return res
}

export function showAboutDialog() {
  if (__LIN__) {
    const win = getMainWindow()
    if (win === null) return

    dialog.showMessageBoxSync(win, {
      type: 'info',
      title: __APP_NAME__,
      message: __APP_NAME__,
      detail: `Version ${__APP_VERSION__}`,
    })
  } else {
    app.showAboutPanel()
  }
}

export async function show_open_folder_window() {
  const win = getMainWindow()

  if (win === null) return null

  const res = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
  })

  if (res.filePaths.length > 0) {
    return res.filePaths[0]
  }
  return null
}

export async function openExternalUrl(url: string) {
  await shell.openExternal(url)
}

export async function showItemInFolder(dir: string) {
  shell.showItemInFolder(resolve(dir))
}

export async function closeApp() {
  getMainWindow()?.close()
}

export async function captureRect(rect: Rectangle): Promise<string> {
  const capture = (await getMainWindow()?.webContents.capturePage(rect)) ?? null

  return capture?.toDataURL() ?? ''
}

export function convertRendererMenu(menus: RenderMenuItem[]): MenuItemOptions[] {
  return menus.map(({submenu, click, ...rest}) => {
    return {
      ...rest,
      submenu: submenu ? convertRendererMenu(submenu) : undefined,
      click:
        click !== undefined
          ? async () => {
              const {name, args} = click

              await callInRenderer(name, ...args)
            }
          : undefined,
    }
  })
}

export function setApplicationMenu(menu: RenderMenuItem[]) {
  Menu.setApplicationMenu(Menu.buildFromTemplate(convertRendererMenu(menu)))
}

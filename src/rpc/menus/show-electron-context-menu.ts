import {RenderMenuItem} from './menu-types'
import {Menu, MenuItem} from 'electron'
import {convertRendererMenu} from '../electron-rpc'
import {getMainWindow} from '../../main-process/main-window'

// Note: This gets called in Main process, not renderer.
export function showElectronContextMenu(
  items: RenderMenuItem[],
  x: number,
  y: number
): Promise<void> {
  return new Promise(resolve => {
    const zoom = getMainWindow()?.webContents.getZoomFactor() ?? 1

    x *= zoom
    y *= zoom

    if (__MAC__) {
      y += 5
    }

    const menu = new Menu()

    for (const item of convertRendererMenu(items)) {
      menu.append(new MenuItem(item))
    }

    menu.popup({
      x: Math.round(x),
      y: Math.round(y),
      callback: () => {
        setTimeout(() => {
          resolve()
        }, 100)
      },
    })
  })
}

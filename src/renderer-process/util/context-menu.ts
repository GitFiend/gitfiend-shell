import {MenuItemOptions} from '../../rpc/menus/menu-types'
import {
  clearContextMenuFunctions,
  convertFromRenderer,
} from '../../rpc/menus/convert-from-renderer'
import {Main} from '../../rpc/main-proxy'

let contextMenuPromise = Promise.resolve()
let lastContextMenuId = ''
let isOpen = false
let lastMouseDownClosedMenu = false

document.addEventListener('mousedown', () => {
  // Always fires before 'menu-will-close'.
  lastMouseDownClosedMenu = isOpen
})

export interface ContextMenuOptions {
  usePoint?: boolean
  classNames?: string[]
  native?: boolean // TODO: Remove this?
}

export async function showContextMenu(
  // Sometimes calculating menu items requires async.
  // We need to do all our calculations on the mouse event synchronously, otherwise the DOM
  // state may have changed.
  items: MenuItemOptions[] | Promise<MenuItemOptions[]>,
  e: MouseEvent,
  options: ContextMenuOptions = {},
): Promise<void> {
  e.preventDefault()

  return showNativeContextMenu(items, e, options)
}

async function showNativeContextMenu(
  items: MenuItemOptions[] | Promise<MenuItemOptions[]>,
  e: MouseEvent,
  options: ContextMenuOptions = {},
): Promise<void> {
  e.stopPropagation()

  if (e.currentTarget !== null) {
    const target = e.currentTarget as HTMLElement

    const rect = target.getBoundingClientRect()

    let x, y

    if (options.usePoint === true) {
      x = e.clientX
      y = e.clientY
    } else {
      x = rect.left
      y = rect.bottom
    }

    if (contextMenuWasOpen() && lastContextMenuId === mkId(x, y)) return

    if (options.classNames !== undefined) target.classList.add(...options.classNames)

    const menuItems = convertFromRenderer(await items, 'context')

    // await callInMain('showContextMenu', menuItems, x, y)
    isOpen = true
    lastContextMenuId = mkId(x, y)
    await Main.showContextMenu(menuItems, x, y)

    clearContextMenuFunctions()

    if (options.classNames !== undefined) target.classList.remove(...options.classNames)
    isOpen = false
  }
}

function contextMenuWasOpen(): boolean {
  return lastMouseDownClosedMenu || isOpen
}

export function isContextMenuOpen(): boolean {
  return isOpen
}

export function getContextMenuPromise(): Promise<void> {
  return contextMenuPromise
}

function mkId(x: number, y: number): string {
  return `${x}${y}`
}

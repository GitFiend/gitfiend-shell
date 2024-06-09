import {MenuItemOptions, RenderMenuItem} from './menu-types'

type MenuType = 'main' | 'context'

export function convertFromRenderer(
  menus: MenuItemOptions[],
  menuType: MenuType
): RenderMenuItem[] {
  return menus.map(({submenu, click, ...rest}) => {
    return {
      ...rest,
      submenu: submenu ? convertFromRenderer(submenu, menuType) : undefined,
      click: convertClick(click, menuType),
    }
  })
}

let id = 0

function convertClick(
  click: (() => void) | undefined,
  menuType: MenuType
): RenderMenuItem['click'] {
  if (click === undefined) return undefined

  id++

  switch (menuType) {
    case 'main':
      mainMenuFunctions.set(id, click)

      return {
        name: 'callMainMenuFunction',
        args: [id],
      }
    case 'context':
      contextMenuFunctions.set(id, click)

      return {name: 'callContextMenuFunction', args: [id]}
  }
}

const contextMenuFunctions = new Map<number, () => void>()

export function callContextMenuFunction(functionId: number) {
  contextMenuFunctions.get(functionId)?.()
}

export function clearContextMenuFunctions() {
  contextMenuFunctions.clear()
}

const mainMenuFunctions = new Map<number, () => void>()

export function callMainMenuFunction(functionId: number) {
  mainMenuFunctions.get(functionId)?.()
}

export function clearMainMenuFunctions() {
  mainMenuFunctions.clear()
}

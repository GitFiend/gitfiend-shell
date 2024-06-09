import type {MenuItemConstructorOptions} from 'electron'
import {RendererFunctions} from '../renderer-functions'

export interface MenuItemOptions extends MenuItemConstructorOptions {
  // We can't use the original for our custom context menu.
  click?: () => void
  submenu?: MenuItemOptions[]
}

export interface RenderMenuItem<
  N extends keyof RendererFunctions = keyof RendererFunctions
> extends Omit<MenuItemOptions, 'click' | 'submenu'> {
  click?: {
    name: N
    args: Parameters<RendererFunctions[N]>
  }
  submenu?: RenderMenuItem<N>[]
}

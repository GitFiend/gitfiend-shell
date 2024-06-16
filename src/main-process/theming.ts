import {nativeTheme, systemPreferences} from 'electron'
import {callInRenderer} from '../rpc/call-in-renderer'

export function setupTheming() {
  nativeTheme.on('updated', sendThemeVarsToRenderer)
}

export function sendThemeVarsToRenderer(): Promise<void> {
  if (__JEST__) {
    return callInRenderer('setThemeInRenderer', 'light', 'light', null)
  }

  return callInRenderer(
    'setThemeInRenderer',
    nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
    nativeTheme.themeSource,
    __LIN__ ? null : systemPreferences.getAccentColor(),
  )
}

export function setTheme(theme: 'light' | 'dark' | 'system') {
  if (__JEST__) return

  if (nativeTheme.themeSource !== theme) {
    nativeTheme.themeSource = theme
  }
}

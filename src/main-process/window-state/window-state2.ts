import {app, BrowserWindow, Rectangle, screen} from 'electron'
import {join} from 'path'
import {readFileSync, writeFileSync} from 'fs'
import {ensureDirSync} from '../../lib/node-util'
import {_debounce} from '../../lib/general-functions'

// Staying compatible with the original window-state.json
interface StoredWindowState {
  width: number
  height: number
  x?: number
  y?: number
  isMaximized?: boolean
  isFullScreen?: boolean

  displayBounds: {
    x: number
    y: number
    width: number
    height: number
  }
}

class WindowState {
  private state: StoredWindowState

  private dir = app.getPath('userData')
  private windowStateFilePath = join(this.dir, 'window-state.json')
  private win: BrowserWindow | null = null

  constructor(
    private defaultWidth: number,
    private defaultHeight: number,
  ) {
    const {bounds} = screen.getPrimaryDisplay()

    this.state = {
      width: defaultWidth,
      height: defaultHeight,
      isMaximized: false,
      isFullScreen: false,
      displayBounds: bounds,
      ...this.loadWindowStateFile(),
    }

    this.validateState()
  }

  getState(): {
    x?: number
    y?: number
    width: number
    height: number
  } {
    return {
      x: this.state.x,
      y: this.state.y,
      width: this.state.width,
      height: this.state.height,
    }
  }

  watch(win: BrowserWindow) {
    this.win = win
    const {isMaximized, isFullScreen} = this.state
    if (isMaximized) {
      win.maximize()
    }
    if (isFullScreen) {
      win.setFullScreen(true)
    }

    win.on('resize', this.onChange)
    win.on('move', this.onChange)
  }

  unWatch() {}

  onChange = _debounce(() => {
    if (this.win) this.updateState(this.win)
  }, 100)

  onClose = () => {
    this.unWatch()
    this.win && this.saveState(this.win)
  }

  private saveState(win: BrowserWindow) {
    this.updateState(win)

    try {
      ensureDirSync(this.dir)
      writeFileSync(this.windowStateFilePath, JSON.stringify(this.state))
    } catch (e) {}
  }

  private updateState(win: BrowserWindow) {
    try {
      const winBounds = win.getBounds()
      if (!win.isMaximized() && !win.isMinimized() && !win.isFullScreen()) {
        this.state.x = winBounds.x
        this.state.y = winBounds.y
        this.state.width = winBounds.width
        this.state.height = winBounds.height
      }
      this.state.isMaximized = win.isMaximized()
      this.state.isFullScreen = win.isFullScreen()
      this.state.displayBounds = screen.getDisplayMatching(winBounds).bounds
    } catch (err) {
      // Don't throw if window is closed
    }
  }

  private resetToDefault() {
    const displayBounds = screen.getPrimaryDisplay().bounds
    this.state = {
      width: this.defaultWidth,
      height: this.defaultHeight,
      x: displayBounds.x,
      y: displayBounds.y,
      displayBounds,
    }
  }

  private windowWithinBounds(bounds: Rectangle): boolean {
    const {x = 0, y = 0, width, height} = this.state

    return (
      x >= bounds.x &&
      y >= bounds.y &&
      x + width <= bounds.x + bounds.width &&
      y + height <= bounds.y + bounds.height
    )
  }

  private ensureWindowVisibleOnSomeDisplay() {
    const visible = screen.getAllDisplays().some(display => {
      return this.windowWithinBounds(display.bounds)
    })

    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return this.resetToDefault()
    }
  }

  private validateState() {
    const isValid = this.hasBounds() || this.state.isMaximized || this.state.isFullScreen
    if (!isValid) {
      this.state = {
        width: this.defaultWidth,
        height: this.defaultHeight,
        displayBounds: screen.getPrimaryDisplay().bounds,
      }
      return
    }

    if (this.hasBounds() && this.state.displayBounds) {
      this.ensureWindowVisibleOnSomeDisplay()
    }
  }

  private hasBounds() {
    const {x, y, width, height} = this.state

    return typeof x === 'number' && typeof y === 'number' && width > 0 && height > 0
  }

  private loadWindowStateFile(): StoredWindowState | null {
    try {
      const text = readFileSync(this.windowStateFilePath, 'utf8')

      if (text.length === 0) return null

      return JSON.parse(text)
    } catch (e) {
      console.log(e)
    }

    return null
  }
}

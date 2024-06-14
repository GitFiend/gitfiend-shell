import {RendererFunctions} from './renderer-functions'
import {getMainWindow} from '../main-process/main-window'
import {getRpcCaller} from './rpc-call'

export const callInRenderer: <N extends keyof RendererFunctions>(
  name: N,
  ...args: Parameters<RendererFunctions[N]>
) => Promise<ReturnType<RendererFunctions[N]>> = initCallInRenderer()

function initCallInRenderer<N extends keyof RendererFunctions>() {
  if (__JEST__) {
    const {rendererFunctions} = require('./renderer-functions')

    return async (name: N, ...args: Parameters<RendererFunctions[N]>) =>
      rendererFunctions[name](...args)
  }

  const {ipcMain} = require('electron')

  return getRpcCaller('call-in-renderer', sender, ipcMain)
}

function sender(channel: string, ...args: any[]) {
  getMainWindow()?.webContents.send(channel, ...args)
}

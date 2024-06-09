export interface RpcRequest<T extends any[], F = string> {
  functionName: F
  args: T
  callNum: number
}

export interface RpcResponse<T> {
  result: T
  callNum: number
}

export type RpcSender = (channel: string, ...args: any[]) => void

export type RpcReceiver = {
  on: (channel: string, listener: (event: unknown, ...args: any[]) => void) => unknown
}

export type RpcListener = (event: unknown, ...args: any[]) => void

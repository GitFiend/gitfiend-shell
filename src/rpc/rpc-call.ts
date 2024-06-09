import {createResolver, Resolver} from '../lib/resolver'
import {RpcReceiver, RpcRequest, RpcResponse, RpcSender} from './rpc-shared'

export function getRpcCaller(
  channel: string,
  sender: RpcSender,
  receiver: RpcReceiver
): (name: string, ...args: any[]) => Promise<any> {
  const rcp = new Rpc(channel, sender, receiver)

  return rcp.call
}

class Rpc {
  callsInProgress = new Map<number, Resolver<unknown>>()
  callCount = 0

  constructor(
    private channel: string,
    private send: RpcSender,
    private onObject: RpcReceiver
  ) {
    onObject.on(channel, (event, response: RpcResponse<unknown>) => {
      const {callNum, result} = response

      this.callsInProgress.get(callNum)?.(result)
      this.callsInProgress.delete(callNum)
    })
  }

  call = (name: string, ...args: any[]): Promise<unknown> => {
    if (__BROWSER_ONLY__ && !__MAC_NATIVE__) {
      return Promise.resolve(undefined)
    }

    const callNum = this.getNextId()
    const {resolver, promise} = createResolver<unknown>()

    const request: RpcRequest<typeof args> = {
      functionName: name,
      args,
      callNum,
    }

    this.send(this.channel, request)

    this.callsInProgress.set(callNum, resolver)

    return promise
  }

  getNextId(): number {
    this.callCount++

    return this.callCount
  }
}

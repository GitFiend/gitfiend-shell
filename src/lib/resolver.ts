export type Resolver<T> = (value: T | PromiseLike<T>) => void

export function createResolver<T = void>(): {resolver: Resolver<T>; promise: Promise<T>} {
  let resolver: Resolver<T>

  const promise = new Promise<T>((resolve: Resolver<T>) => {
    resolver = resolve
  })

  return {
    promise,
    // Promises are technically started synchronously, so this should work.
    resolver: resolver!,
  }
}

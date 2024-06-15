export function _mapO<K extends string, V, T>(
  o: Record<K, V>,
  func: (value: V, key: K) => T,
): T[] {
  const keys = Object.keys(o) as K[]
  const out: T[] = []

  for (const key of keys) {
    out.push(func(o[key], key))
  }

  return out
}

export function _debounce<T extends Function, A extends any[], R>(
  func: (...a: A) => R,
  wait: number,
): (...a: A) => void {
  let t: ReturnType<typeof setTimeout>

  return (...a: A) => {
    clearTimeout(t)

    t = setTimeout(() => {
      func(...a)
    }, wait)
  }
}

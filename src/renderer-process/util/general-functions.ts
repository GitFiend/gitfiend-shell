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

export function parsePort(text: string): number | null {
  if (!text.includes('PORT:')) {
    return null
  }

  return parseInt(text.split('PORT:')[1])
}

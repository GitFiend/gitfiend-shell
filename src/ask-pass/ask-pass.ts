const response = handlePrompt(process.argv[2])

if (response !== undefined) {
  process.stdout.write(response)
  process.stdout.end()
}

export function handlePrompt(prompt: string): string | undefined {
  if (prompt.startsWith('Username')) return process.env.GITFIEND_USERNAME
  else if (prompt.startsWith('Password')) return process.env.GITFIEND_PASSWORD

  return undefined
}

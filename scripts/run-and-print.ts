import {spawn} from 'child_process'

interface Options {
  command: string
  args: string[]
  dir: string
}

export function runAndPrint({command, dir, args}: Options): {
  promise: Promise<number | null>
  kill: () => void
} {
  let kill = () => {}

  const p = new Promise<number | null>(resolve => {
    console.log(`${command} ${args.join(' ')}`)

    const proc = spawn(command, args, {cwd: dir, stdio: 'inherit'})

    kill = () => {
      proc.kill(1)
    }

    proc.on('exit', code => {
      resolve(code)
    })
  })

  return {promise: p, kill}
}

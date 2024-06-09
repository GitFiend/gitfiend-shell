import {spawn} from 'child_process'

interface Options {
  command: string
  args: string[]
  dir: string
}

export function runAndPrint({command, dir, args}: Options) {
  return new Promise(resolve => {
    console.log(`${command} ${args.join(' ')}`)

    const proc = spawn(command, args, {cwd: dir, stdio: 'inherit'})

    proc.on('exit', resolve)
  })
}

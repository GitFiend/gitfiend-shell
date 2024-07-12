import {getCwd} from './util'
import {platform} from 'os'

export function handleCommandLineHelp() {
  if (process.argv.some(arg => arg === '-h' || arg === '--help')) {
    if (platform() === 'darwin') {
      printHelpMac()
    } else {
      printHelp()
    }

    process.exit(0)
  }
}

function printHelp() {
  const command = process.argv
    .filter(arg => arg !== '-h' && arg !== '--help')
    .join(' ')
    .replace(getCwd(), '')

  console.log(`Usage: ${command} [-h | --help] [<path>]`)
}

function printHelpMac() {
  console.log(`Usage: open GitFiend --args [-h | --help] [<path>]`)
}

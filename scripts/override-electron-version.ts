import {platform} from 'os'
import {execSync} from 'child_process'

switch (platform()) {
  case 'darwin': {
    // installVersion('19.1.9')
    break
  }
  case 'win32': {
    // installVersion('15.2.0')
    break
  }
  case 'linux': {
    // installVersion('18.3.15')
    break
  }
  default:
    break
}

function installVersion(version: string) {
  try {
    console.log(`Installing electron ${version}...`)

    console.log(execSync(`npm install electron@${version} --no-save`, {encoding: 'utf8'}))
  } catch (e) {
    console.log(e)
  }
}

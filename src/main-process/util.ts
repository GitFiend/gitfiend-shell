import path from 'path'
import fs from 'fs'

export function getCwd(): string {
  if (__MAC__) {
    const pwd = process.env.PWD
    if (pwd !== undefined) return pwd
  }
  return process.cwd()
}

export function removePathSync(aPath: string): void {
  if (fs.existsSync(aPath)) {
    if (fs.lstatSync(aPath).isDirectory()) {
      for (const file of fs.readdirSync(aPath)) {
        const curPath = path.join(aPath, file)

        if (fs.lstatSync(curPath).isDirectory()) removePathSync(curPath)
        else fs.unlinkSync(curPath)
      }
      fs.rmdirSync(aPath)
    } else {
      fs.unlinkSync(aPath)
    }
  }
}

export function copyFolderSync(from: string, to: string): void {
  fs.mkdirSync(to)

  const fromDirContents = fs.readdirSync(from)

  for (const element of fromDirContents) {
    const elementPath = path.join(from, element)
    const stats = fs.lstatSync(elementPath)

    if (stats.isDirectory()) {
      copyFolderSync(elementPath, path.join(to, element))
    } else if (stats.isSymbolicLink()) {
      const link = fs.readlinkSync(elementPath)
      fs.symlinkSync(link, path.join(to, element))
    } else {
      fs.copyFileSync(elementPath, path.join(to, element))
    }
  }
}

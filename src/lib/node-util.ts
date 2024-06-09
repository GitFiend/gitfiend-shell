// Put nodejs only util functions here.
import path from 'path'
import fs from 'fs'

export function ensureDirSync(dirPath: string): void {
  const parts = path.normalize(dirPath).split(path.sep)

  if (parts.length > 1) {
    for (let i = 1; i < parts.length; i++) {
      const currentPath = parts.slice(0, i + 1).join(path.sep)

      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath)
      }
    }
  }
}

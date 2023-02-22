import fs from 'fs'

export function rename(oldPath: string, newPath: string) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

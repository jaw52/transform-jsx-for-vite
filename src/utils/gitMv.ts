import { rename } from 'node:fs/promises'
import { execa } from 'execa'

export const gitMv = async (oldPath: string, newPath: string) => {
  try {
    await execa('git', ['mv', oldPath, newPath])
  }
  catch (err) {
    try {
      await rename(oldPath, newPath)
    }
    catch (error) {
      return Promise.reject(error)
    }
  }
}

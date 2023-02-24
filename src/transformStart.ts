import fs from 'fs'
import { rename } from 'node:fs/promises'
import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
import consola from 'consola'
import { execa } from 'execa'
import slash from 'slash'
import glob from 'fast-glob'
import { loadArgs } from './loadArgs'

const traverse = (_traverse as any).default as typeof _traverse

const gitMv = async (oldPath: string, newPath: string) => {
  try {
    await execa('git', ['mv', oldPath, newPath])
    consola.log('Git mv ok       ', oldPath)
  } catch (err) {
    try {
      await rename(oldPath, newPath)
      consola.log('Nodejs rename ok', oldPath)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

/**
 * @param scanPath 扫描目录
 * @param isGitMv 是否是Git mv方式迁移
 * @returns 迁移的文件List
 */
export const transformStart = async (scanPath: string, isGitMv: 1 | 0): Promise<string[]> => {
  const ignore = loadArgs()
  const tsFiles = glob.sync(`${slash(scanPath)}/**/*.{ts,js}`, {
    ignore: ignore.length > 0
      ? ['**/node_modules/**', '**/dist/**', ...ignore]
      : ['**/node_modules/**', '**/dist/**'],
  })
  const times = 0
  const needTransformList: string[] = []

  for (const path of tsFiles) {
    const source = fs.readFileSync(path, 'utf-8')

    try {
      const ast = parser.parse(source, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'dynamicImport', 'classProperties', 'decorators'],
      })

      traverse(ast, {
        enter(pathNode) {
          if (needTransformList.includes(path)) {
            pathNode.stop()
          }

          if (pathNode.isJSX() && !needTransformList.includes(path))
            needTransformList.push(path)
        },
      })
    } catch (err) {
      consola.error('Babel failed to parse the file', err)
    }
  }
  consola.log(times)
  await Promise.all(
    needTransformList.map((oldPath) => {
      const target = oldPath.includes('.js')
        ? oldPath.replace(/.js$/, '.jsx')
        : oldPath.replace(/.ts$/, '.tsx')

      return (
        async () => {
          if (isGitMv === 1) {
            try {
              await gitMv(oldPath, target)
            } catch (error) {
              console.error('Project migration code failed. You can try another way to migrate', error)
            }
          } else {
            try {
              await rename(oldPath, target)
              consola.log('Nodejs rename ok', oldPath)
            } catch (error) {
              consola.error('Project migration code failed', error)
            }
          }
        }
      )()
    }),
  )

  return needTransformList
}

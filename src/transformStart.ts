import fs from 'fs'
import { rename } from 'node:fs/promises'
import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
import consola from 'consola'
import slash from 'slash'
import glob from 'fast-glob'
import ora from 'ora'
import { loadArgs } from './utils/loadArgs'
import { gitMv } from './utils/gitMv'
import { formatMs } from './utils/formatTime'

const traverse = (_traverse as any).default as typeof _traverse

const runRename = async (oldPath: string, isGitMv: 1 | 0) => {
  const target = oldPath.includes('.js')
    ? oldPath.replace(/.js$/, '.jsx')
    : oldPath.replace(/.ts$/, '.tsx')

  if (isGitMv === 1) {
    try {
      await gitMv(oldPath, target)
    }
    catch (error) {
      console.error('Project migration code failed. You can try another way to migrate', error)
    }
  }
  else {
    try {
      await rename(oldPath, target)
    }
    catch (error) {
      consola.error('Project migration code failed', error)
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
    }
    catch (err) {
      consola.error('Babel failed to parse the file', err)
    }
  }

  const spinner = ora()
  const startTime = Date.now()

  try {
    spinner.start('Start scanning\n')
    await Promise.all(
      needTransformList.map(path => runRename(path, isGitMv)),
    )

    const runTime = formatMs(Date.now() - startTime)
    spinner.succeed(`Finish scanning - ${runTime}`)
  }
  catch {
    spinner.fail('Fail')
  }

  return needTransformList
}

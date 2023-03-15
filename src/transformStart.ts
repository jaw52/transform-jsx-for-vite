import fs from 'fs'
import { rename } from 'node:fs/promises'
import { extname } from 'path'
import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
import consola from 'consola'
import slash from 'slash'
import glob from 'fast-glob'
import ora from 'ora'
import pLimit from 'p-limit'
import { loadArgs } from './utils/loadArgs'
import { gitMv } from './utils/gitMv'
import { formatMs } from './utils/formatTime'
import locales from './utils/locales'
import type { Setting } from '.'

const traverse = (_traverse as any).default as typeof _traverse

const runRename = async (oldPath: string, isGitMv: 1 | 0) => {
  const target = extname(oldPath) === '.js'
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
 * @returns 迁移的文件List
 */
export const transformStart = async ({ scanPath, isGitMv, lang, mode }: Setting): Promise<string[]> => {
  const t = locales[lang]
  const { ignore, concurrency } = loadArgs()

  const tsFiles = glob.sync(`${slash(scanPath)}/**/*.{ts,js}`, {
    ignore: ignore.length > 0
      ? ['**/node_modules/**', '**/dist/**', ...ignore]
      : ['**/node_modules/**', '**/dist/**'],
  })

  const needTransformList: string[] = []

  for (const path of tsFiles) {
    const source = fs.readFileSync(path, 'utf-8')

    if (mode === 'fast') {
      const reactRE = /[\'"]\s*react\s*[\'"]/
      const htmlRE = /<(\w+)[^>]*>(.*?<\/\1>)?/

      if (reactRE.test(source) && htmlRE.test(source))
        needTransformList.push(path)
    }
    else {
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
        consola.error(`${t.babelFail} ${path} : ${err}`)
      }
    }
  }

  const spinner = ora()
  const startTime = Date.now()

  try {
    spinner.start(`${t.start}\n`)
    const limit = pLimit(concurrency)

    await Promise.all(
      needTransformList.map(path => limit(async () => runRename(path, isGitMv))),
    )

    const runTime = formatMs(Date.now() - startTime)
    spinner.succeed(`${t.finish} - ${runTime}`)
  }
  catch {
    spinner.fail('Fail')
  }

  return needTransformList
}

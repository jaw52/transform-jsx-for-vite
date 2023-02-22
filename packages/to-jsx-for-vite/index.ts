import fs from 'fs'
import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
import glob from 'glob'
import { gray, green } from 'kolorist'
import prompts from 'prompts'
import slash from 'slash'

const traverse = (_traverse as any).default as typeof _traverse

const runTransform = async () => {
  const { scanPath } = await prompts({
    type: 'text',
    name: 'scanPath',
    message: '请指定需要扫描的文件夹',
    initial: 'src',
  }) as { scanPath: string }

  const tsFiles = glob.sync(`${slash(scanPath)}/**/*.{ts,js}`, {
    ignore: ['**/*.test.js', '**/*.{d,types,type}.ts', '**/*{types,type}.ts', '**/node_modules/**'],
  })

  const needTransformList: string[] = []

  tsFiles.forEach(async (path) => {
    const source = fs.readFileSync(path, 'utf-8')

    const ast = parser.parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'dynamicImport', 'classProperties'],
    })

    traverse(ast, {
      enter(pathNode) {
        if (pathNode.isJSX() && !needTransformList.includes(path))
          needTransformList.push(path)
      },
    })
  })

  needTransformList.forEach((item) => {
    const target = item.includes('.js')
      ? item.replace(/.js$/, '.jsx')
      : item.replace(/.ts$/, '.tsx')

    fs.rename(item, target, (err) => {
      if (err)
        throw err
    })
  })

  if (needTransformList.length > 0) {
    console.log(`${green('√')} 完成${green('to jsx')}`)
  } else {
    console.log(`${gray('-')} 没有需要${green('to jsx')}的文件`)
  }
}

runTransform()

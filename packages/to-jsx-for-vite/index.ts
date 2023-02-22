import fs from 'fs'
import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
import glob from 'glob'
import { gray, green, red } from 'kolorist'
import prompts from 'prompts'
import slash from 'slash'
import { execa } from 'execa'

const traverse = (_traverse as any).default as typeof _traverse

const transformStart = async (scanPath: string, isGit: 1 | 0): Promise<string[]> => {
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

  if (isGit === 1) {
    needTransformList.forEach(async (item) => {
      const target = item.includes('.js')
        ? item.replace(/.js$/, '.jsx')
        : item.replace(/.ts$/, '.tsx')

      try {
        await execa('git', ['mv', item, target])
      } catch (error: any) {
        console.log(`${red('×')} ERROR: Git项目迁移代码失败，请尝试另外一种方式. stderr: ${error}`)
      }
    })
  } else {
    needTransformList.forEach(async (item) => {
      const target = item.includes('.js')
        ? item.replace(/.js$/, '.jsx')
        : item.replace(/.ts$/, '.tsx')

      fs.rename(item, target, (err) => {
        if (err)
          throw err
      })
    })
  }

  return needTransformList
}

const runTransform = async () => {
  const { scanPath, isGit } = await prompts([{
    type: 'text',
    name: 'scanPath',
    message: '请指定需要扫描的文件夹',
    initial: 'src',
  }, {
    type: 'select',
    name: 'isGit',
    message: '需要扫描的文件夹是否由Git托管',
    initial: 1,
    choices: [
      { title: 'Yes', value: 1 },
      { title: 'No', value: 0 },
    ],
  }]) as { scanPath: string; isGit: 1 | 0 }

  if (!fs.existsSync(scanPath) || fs.lstatSync(scanPath).isFile()) {
    console.error(`${red('×')} 请检查路径是否正确`)
    return
  }
  const needTransformList = await transformStart(scanPath, isGit)

  if (needTransformList.length > 0) {
    console.log(`${green('√')} 完成${green('to jsx')}`)
  } else {
    console.log(`${gray('- 未发现需要迁移的文件')}`)
  }
}

runTransform()

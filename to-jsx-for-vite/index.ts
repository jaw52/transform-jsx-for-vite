import fs from 'fs'
import glob from 'glob'
import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
const traverse = (_traverse as any).default as typeof _traverse

const runTransform = () => {
  const tsFiles = glob.sync('src/**/*.{ts,js}', {
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
}

runTransform()

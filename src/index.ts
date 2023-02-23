import fs from 'fs'
import { gray, green } from 'kolorist'
import prompts from 'prompts'
import { transformStart } from './transformStart'
import { warnUtil } from './consoleUtil'

const runTransform = async () => {
  const { scanPath, isGitMv } = await prompts([{
    type: 'text',
    name: 'scanPath',
    message: '请指定需要扫描的文件夹',
    initial: 'src',
  }, {
    type: 'select',
    name: 'isGitMv',
    message: '是否使用Git mv方式进行批量修改后缀名（Git托管的项目 推荐这种方式）',
    initial: 0,
    choices: [
      { title: 'Yes', value: 1 },
      { title: 'No', value: 0 },
    ],
  }]) as { scanPath: string; isGitMv: 1 | 0 }

  if (!fs.existsSync(scanPath) || fs.lstatSync(scanPath).isFile()) {
    warnUtil('请检查路径是否正确')
    return
  }
  const needTransformList = await transformStart(scanPath, isGitMv)

  if (needTransformList.length > 0) {
    console.log(`${green('√')} 完成${green('to jsx')}`)
  } else {
    console.log(`${gray('- 未发现需要迁移的文件')}`)
  }
}

runTransform()

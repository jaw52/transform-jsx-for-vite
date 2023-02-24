import fs from 'fs'
import consola from 'consola'
import { green } from 'kolorist'
import prompts from 'prompts'
import locales from './locales'
import { transformStart } from './transformStart'

const runTransform = async () => {
  const { scanPath, isGitMv } = await prompts([
    {
      type: 'select',
      name: 'lang',
      message: 'Please select language',
      initial: 0,
      choices: [
        { title: '简体中文', value: 'zh' },
        { title: 'English', value: 'en' },
      ],
    },
    {
      type: 'text',
      name: 'scanPath',
      message: (_, values) => locales[values.lang].scanPath,
      validate: value => (!fs.existsSync(value?.trim()) || fs.lstatSync(value?.trim()).isFile()) ? 'Please check the path' : true,
      initial: 'src',
    },
    {
      type: 'select',
      name: 'isGitMv',
      message: (_, values) => locales[values.lang].isGitMv,
      initial: 0,
      choices: [
        { title: 'Yes', value: 1 },
        { title: 'No', value: 0 },
      ],
    },
  ], {
    onCancel: () => process.exit(1),
  }) as { scanPath: string; isGitMv: 1 | 0; lang: 'zh' | 'en' }

  const needTransformList = await transformStart(scanPath.trim(), isGitMv)

  if (needTransformList.length > 0) {
    consola.success(`Finish ${green('to jsx')}`)
  } else {
    consola.info('No files found to be migrated')
  }
}

runTransform()

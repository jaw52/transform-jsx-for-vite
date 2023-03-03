import cac from 'cac'
import consola from 'consola'
import { version } from '../../package.json'

const parseIgnore = (ignore?: (string | boolean)[] | string | boolean) => {
  if (!ignore || typeof ignore === 'boolean')
    return []

  if (Array.isArray(ignore))
    return ignore.filter(Boolean).map(el => (el as string)?.trim())

  return ignore.trim().split(',')
}

export const loadArgs = (): { ignore: string[]; concurrency: number } => {
  try {
    const cli = cac('@jaw52/transform-jsx-for-vite')
    cli
      .version(version)
      .option('--ignore <ignore>', 'ignore path')
      .option('--concurrency <concurrency>', 'concurrency limit.')
      .help()

    const { options } = cli.parse() as { options: { ignore?: (string | boolean)[] | string | boolean; concurrency?: number } }

    return { ignore: parseIgnore(options.ignore), concurrency: options.concurrency ?? 5 }
  }
  catch (error) {
    consola.error(error)
    process.exit(1)
  }
}

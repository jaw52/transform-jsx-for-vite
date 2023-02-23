import { red } from 'kolorist'

export const warnUtil = (message: string, err?: any) => {
  if (err) {
    console.log(`${red('×')} ERROR: ${message}。\nstderr: ${err}`)
  } else {
    console.log(`${red('×')} ERROR: ${message}。`)
  }
}

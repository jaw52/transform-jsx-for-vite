// @vuepress/utils code
export const formatMs = (ms: number): string => {
  if (ms < 1000)
    return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

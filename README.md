# transform-jsx-for-vite

[![npm](https://img.shields.io/npm/v/@jaw52/transform-jsx-for-vite)](https://npmjs.com/package/@jaw52/transform-jsx-for-vite)

Translations: <a href="https://github.com/jaw52/transform-jsx-for-vite/blob/main/README-EN.md">简体中文</a>

Batch modify `.js` files containing jsx syntax in traditional React projects to `.jsx`

- ⚡️`.ts`=>`.tsx`,`.js`=>`.jsx`
- 💡Using `babel` recognition, high accuracy（in precise mode）

## Quick Start

Execute the following command under the root directory of the project to be converted

```cmd
npx @jaw52/transform-jsx-for-vite
```

Follow the prompts and wait for batch modification of `.js` suffix

## Instructions for use

### Scan path

If the directory name to be scanned is not src, you can use the relative path to specify it

```bash
# relative path
Please specify the folder to be scanned ./example/src
Please specify the folder to be scanned example/src
Please specify the folder to be scanned ../example/src
```
### Identification mode selection

Used to identify whether the file contains `jsx`

- Precise mode: Use `Babel` to identify, which is more accurate and time-consuming. There may be a Babel recognition error, resulting in some files not converting the suffix (if this is the case, please provide [issue](https://github.com/jaw52/transform-jsx-for-vite/issues)）。

- Fast mode: fast, but less understanding of jsx syntax than `Babel` (but can also cover a large part)

### Ignore path

Manually ignore the scanning of some paths. Refer to [fast-glob](https://github.com/mrmlnc/fast-glob#readme) for rules

```bash
# single path
npx @jaw52/transform-jsx-for-vite --ignore **/example/**
# Multiple paths
npx @jaw52/transform-jsx-for-vite --ignore **/.git/** --ignore **/example/**
# Or use commas(Recommended)
npx @jaw52/transform-jsx-for-vite --ignore **/.git/**,**/example/**
```

### Modify concurrency

Concurrent number of modification commands executed at the same time (default 5)

```bash
npx @jaw52/transform-jsx-for-vite --concurrency 10
```

## Why this library was created

`Vite` does not support `.js` files with `jsx` syntax in React projects

https://github.com/vitejs/vite/discussions/3448

https://github.com/vitejs/vite/discussions/3112

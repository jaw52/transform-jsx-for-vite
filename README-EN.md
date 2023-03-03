# transform-jsx-for-vite

[![npm](https://img.shields.io/npm/v/@jaw52/transform-jsx-for-vite)](https://npmjs.com/package/@jaw52/transform-jsx-for-vite)

> This tool is used to assist the traditional React project to VITE support

This tool helps migrate traditional React projects to Vite,Used in batches to modify `.js` file suffix names (**only modify** files containing` jsx` grammar)

- ⚡️`.ts`=>`.tsx`,`.js`=>`.jsx`
- 💡Using `babel` recognition, high accuracy

## Quick Start

Execute the following command under the root directory of the project to be converted

```cmd
npx @jaw52/transform-jsx-for-vite
```

Wait for batch modification of suffix name of '. js'

## Instructions

### Scan path

If the directory name to be scanned is not src, you can use the relative path to specify it

```bash
# relative path
Please specify the folder to be scanned ./example/src
Please specify the folder to be scanned example/src
Please specify the folder to be scanned ../example/src
```

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
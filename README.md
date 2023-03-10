# transform-jsx-for-vite

[![npm](https://img.shields.io/npm/v/@jaw52/transform-jsx-for-vite)](https://npmjs.com/package/@jaw52/transform-jsx-for-vite)

Translations: <a href="https://github.com/jaw52/transform-jsx-for-vite/blob/main/README-EN.md">English</a>

> 该工具用于辅助将传统react项目迁移至vite支持

该工具辅助迁移传统React项目到Vite中，用于批量修改`.js`文件后缀名（**只修改**含`jsx`语法的文件）。

- ⚡️`.ts`=>`.tsx`,`.js`=>`.jsx`
- 💡使用`babel`识别，准确率高

## 快速开始

需要进行转换的项目根目录下执行以下命令

```cmd
npx @jaw52/transform-jsx-for-vite
```

等待批量修改`.js`的后缀名

## 使用

### 扫描路径

如果需要扫描的目录名称不是src，可以使用相对路径进行指定

```bash
# 相对路径
请指定需要扫描的文件夹 ./example/src
请指定需要扫描的文件夹 example/src
请指定需要扫描的文件夹 ../example/src
```

### 忽略路径

手动忽略某些路径的扫描，规则参照[fast-glob](https://github.com/mrmlnc/fast-glob#readme)

```bash
# 单个路径
npx @jaw52/transform-jsx-for-vite --ignore **/example/**
# 多个路径
npx @jaw52/transform-jsx-for-vite --ignore **/.git/** --ignore **/example/**
# 或者使用逗号隔开(推荐)
npx @jaw52/transform-jsx-for-vite --ignore **/.git/**,**/example/**
```

### 修改并发数

同一时间执行修改命令的并发数量（默认为5）

```bash
npx @jaw52/transform-jsx-for-vite --concurrency 10
```
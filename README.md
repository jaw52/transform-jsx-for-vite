# transform-jsx-for-vite

[![npm](https://img.shields.io/npm/v/@jaw52/transform-jsx-for-vite)](https://npmjs.com/package/@jaw52/transform-jsx-for-vite)

Translations: <a href="https://github.com/jaw52/transform-jsx-for-vite/blob/main/README-EN.md">English</a>

将传统React项目中含jsx语法的`.js`文件批量修改为`.jsx`

- ⚡️`.ts`=>`.tsx`,`.js`=>`.jsx`
- 💡使用`babel`识别，准确率高（准确模式下）

## 快速开始

需要进行转换的项目根目录下执行以下命令

```cmd
npx @jaw52/transform-jsx-for-vite
```

按提示操作，并等待批量修改`.js`的后缀名

## 使用说明

### 扫描路径

如果需要扫描的目录名称不是src，可以使用相对路径进行指定

```bash
# 相对路径
请指定需要扫描的文件夹 ./example/src
请指定需要扫描的文件夹 example/src
请指定需要扫描的文件夹 ../example/src
```

### 识别模式选择

用于识别文件中是否含`jsx`

- 准确模式：使用`Babel`识别，更加准确，耗时一些。可能出现Babel识别错误，导致部分文件未转换后缀名（有这种情况，请提[issue](https://github.com/jaw52/transform-jsx-for-vite/issues)）。
  
- 快速模式：速度快，但对jsx语法的识别程度不如`Babel`（但也能覆盖很大部分）。

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

## 为什么创建这个库

`Vite`不支持React项目中含`jsx`语法的`.js`文件

https://github.com/vitejs/vite/discussions/3448

https://github.com/vitejs/vite/discussions/3112
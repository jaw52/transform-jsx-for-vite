# transform-jsx-for-vite

Translations Docs: <a href="https://github.com/jaw52/transform-jsx-for-vite/blob/main/README.md">English</a>

> 该工具用于辅助将传统react项目迁移至vite支持

用于批量修改`.js`文件后缀名（只修改含`jsx`语法的文件）

- ⚡️`.ts`=>`.tsx`,`.js`=>`.jsx`
- 💡使用`babel`识别，准确率高

## 快速开始

需要进行转换的项目根目录下执行以下命令

```cmd
npx @jaw52/transform-jsx-for-vite
```

等待批量修改`.js`的后缀名

## 使用

如果需要扫描的目录名称不是src，可以使用相对路径进行指定

```bash
# 相对路径
请指定需要扫描的文件夹 ./example/src
请指定需要扫描的文件夹 example/src
请指定需要扫描的文件夹 ../example/src
```

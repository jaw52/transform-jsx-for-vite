# transform-jsx-for-vite

vite-react项目中，`.js`使用`jsx`会直接报错，可以使用该工具辅助迁移。

该工具使用`babel`将含有`jsx`语法的`.js`文件后缀名修改为`.jsx`（`.ts`=>`.tsx`同理）

## 快速开始

需要进行转换的项目根目录下执行以下命令

```cmd
npx @jaw52/transform-jsx-for-vite
```

等待批量修改`.js`的后缀名

## 补充说明

如果需要扫描的目录名称不是src，则可以按照提示按以下命令执行

```bash
# 相对路径
请指定需要扫描的文件夹 ./example/src
请指定需要扫描的文件夹 example/src
请指定需要扫描的文件夹 ../example/src

# 绝对路径（不推荐）
请指定需要扫描的文件夹 D:/github/node-tool/packages/example/src
请指定需要扫描的文件夹 ... D:\github\node-tool\example
```
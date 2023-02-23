# transform-jsx-for-vite

> 该工具用于辅助将传统react项目迁移至vite支持

- ⚡️批量将`.js`文件后缀名改为`.jsx`（`.ts`=>`.tsx`同理）
- 💡使用`babel`识别含`jsx`语法的`.js`文件（不更改普通`.js`文件后缀名）

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

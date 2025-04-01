# @kway-teow/utils

[![npm version](https://img.shields.io/npm/v/@kwayteow/utils)](https://www.npmjs.com/package/@kwayteow/utils)
[![npm downloads](https://img.shields.io/npm/dm/@kwayteow/utils)](https://www.npmjs.com/package/@kwayteow/utils)

一个实用的 TypeScript 工具函数库，提供了常用的工具函数集合。

## 安装

```bash
npm install @kwayteow/utils

# 或者
yarn add @kwayteow/utils

# 或者
pnpm add @kwayteow/utils

```

## 使用

```typescript
import { formatDate, formatBankCard, capitalize } from '@kwayteow/utils
'

// 日期格式化
const date = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
console.log(date) // 2024-03-22 10:30:00

```
## 文档

[API](https://kway-teow.github.io/utils/index.html)

## 开发

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev

# 测试
pnpm test

# 提交代码
pnpm cz
```

## License

MIT

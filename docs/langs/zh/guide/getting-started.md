# 快速上手
本文会帮助您从0开始利用`@produck/duck`定义一个产品。

## 安装
1. 如同你习惯的一样利用`npm`或者`yarn`之类的工具，初始化一个工程，
```bash
npm init
```
2. 安装`@produck/duck`作为运行时依赖，
```bash
npm install @produck/duck
```
## 开始一个简单的产品

```js
// index.js

const Duck = require('@produck/duck');
const meta = require('./package.json');

const ExampleFactory = Duck({
	id: 'any.yourgroup.example.other', // 强制为产品设置一个ID
	name: meta.name, // 给产品一个可读的名称
	version: meta.version // 引用产品的版本，可以无关于package.json的内容
}, function Example({ product, injection }, options) {
	// 注入、模块的组装工作在这里进行。

	// 处理一下配置对象
	const timeout = options.timeout;

	// 使用注入对象or注入其他功能
	injection.foo = 'bar';
	//...

	// 导出该产品实例
	return {
		showMeta() {
			// 在指定时间后，用控制台打印该产品的元信息
			setTimeout(() => console.log(product.meta), timeout);
		}
	};
});

// 现在，可以创建一个Example实例.
const example = ExampleFactory({
	timeout: 50
});

// 然后可以使用example.
example.showMeta();

// 或者，作为模块导出
module.exports = ExampleFactory;
```

看上去，产品的名字已经起好啦！开始思考如何补充功能吧。
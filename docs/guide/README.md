# Introduction

Duck是一个可扩展、轻量级、灵活的、渐进式产品组装框架。它依据“依赖注入(DI)”和“控制反转(IoC)”的概念（类似JAVA的Srping Core）帮助开发者创建、使用、管理多种运行时对象作为注入到所需要的任何地方。每位开发者都能以最小的代价扩展框架。

在过去，我们在用Node.js开发时，经常面对一些不灵活的目录组织问题。很多开发者都应该会懊恼从父级目录引用，就像是``require('../../some.js')``。这种现象当然也暗示了某种未预料的耦合设计失控。Duck解决了以上问题并提供了一种编程模式来帮助开发者避免不恰当的设计，同时也鼓励开发者依据具体产品，设置因地制宜的项目结构。

Duck并不强制规范你的代码风格。不过它仍然提供一些必要的指引来推动正确的设计。所以当你使用Duck时，请勇敢的利用你的想象来解决你所面临的问题。

另一方面来说，Duck是一个面向架构师或技术领袖组织研发任务的好用的框架，高层研发工程师会觉得如此构建工作是理所当然的。具体功能的研发工程师也能够在组装功能时感到合理舒适。Duck希望每位开发者不需要拘泥于官方推荐的某种实践风格。Duck尊重和支持每个研发团队自己的实践风格。

> 春江水暖鸭先知<br>The DUCK knows first when the river becomes warm in SPRING.

用Duck来定义你的产品！

## How does it work?

Javascript有一种让`对象实例A`继承`对象实例B`的能力——原型继承模型。利用该特性，Duck构造一个从“抽象作用域”到“具体作用域”的注入树（`Injection` Tree）。首先，内置两个层次：

1. BaseInjection - 提供了Duck原生的注入，支持通过[Component](./using-component.html)方式追加到BaseInjection；
2. InstalledInjection - 组件完成安装后，抛出的注入对象，由Duck用户(User)接手继续混合。

脱离Duck的直接体系之后，扔可以继续派生注入对象。总体来说，从树根到树叶的方向，看上去就像是问题从抽象到具体。

```
抽象 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 具体

┏━━━━━━━━━━━━━━━┓      ┏━━━━━━━━━━━━━━━━━━━━┓      ┏━━━━━━━━━━━━━━━━━━┓     ┏━━━━━━┓
┃ BaseInjection ┃      ┃ InstalledInjection ┃ <|-- ┃ OtherInjection A ┃<|-- ┃ ...  ┃
┃               ┃      ┃                    ┃      ┗━━━━━━━━━━━━━━━━━━┛     ┗━━━━━━┛
┃ * internal    ┃ <|-- ┃ * component        ┃      ┏━━━━━━━━━━━━━━━━━━┓
┃ * component   ┃      ┃ * user             ┃ <|-- ┃ OtherInjection.. ┃
┗━━━━━━━━━━━━━━━┛      ┗━━━━━━━━━━━━━━━━━━━━┛      ┗━━━━━━━━━━━━━━━━━━┛
```

以上的注入对象树带来了很多使用上的便利：

* **轻松注入**：当前注入（Injection）可以随时增加新标识符混入（mixin）新功能，
  ```js
	injection.baz = 'Something';
	injection.foo = function Foo() {
		//....
	};

	injection.baz; // >> 'Something'
	```
* **简单派生**：可以通过十分自然的语法，为“更具体”的作用域提供一个子注入（Child Injection），
  ```js
	injection.foo = 'bar';

	const childInjection = injection.$create();

	childInjection.foo; // >> 'bar'
	```
* **无害隔离**：可以访问父级注入（Parent Injection）注册的功能，可以安全隔离地在重载父级的标识符
  > 因为Javascript原型继承的原因，在当前混入新标识符不会导致prototype对象的修改。
  ```js
	injection.foo = 'bar';

	const childInjection = injection.$create();

  // 在子依赖上访问父级依赖的foo
	childInjection.foo; // >> 'bar'

	// 在子依赖上重载foo
	childInjection.foo = 123;

  // 分别访问
	childInjection.foo; // >> 123
	injection.foo; // >> 'bar'
	```

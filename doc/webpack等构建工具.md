# webpack和rollup区别

## 共同点

webpack和rollup这两个构建工具，都是打包js的。

## 不同点

1. webpack默认入口文件是esm或者commonjs都支持打包，而rollup默认入口文件只支持esm，如果入口文件是commonjs的话需要插件额外支持。即webpack可以根据一个入口文件，比如是esm的入口文件，打包出cjs/amd/umd等其他模块化的包。或者一个cjs的入口文件，打包出esm/amd/umd等其他模块化的包。而rollup默认只能由一个esm入口文件，打包出cjs/adm/umd等其他模块化的包。如果入口文件是使用cjs的，则基本就是原封不动的输出这份cjs代码，也不会做tree shaking。

2. 早期webpack不支持tree shaking时（webpack2.x才开始支持），rollup具备更强的优势
3. rollup默认就支持esm的tree shaking，webpack得配置terser
4. webpack一般用来打包应用，因为webapck会根据不同的模块化，自己实现一套以让浏览器能兼容，可以理解为，webpack自己实现polyfill支持不同模块语法；而rollup因为利用了高版本浏览器原生支持esm，所以rollup打包出来的包没有额外的polyfill代码，因此就对比webpack的代码量干净了很多，当然确定就是兼容性问题，因为高版本浏览器才支持esm。



# webpack实现模块化

## commonjs

文件路径作为key，文件的内容作为值放在一个函数里，使用webpack_require替换require，使用webpack_require_cache作为缓存

## esm





# 意外发现

从一个cjs模块化的入口文件，使用rollup打包成esm和cjs的包，会发现，入口文件并没有导出东西，但是实际打包成esm和cjs后，还是会导出一个空的东西。

入口文件：

```js
const { dateFormat, priceFormat } = require('./js/format');

console.log(dateFormat('1213'));
```



打包后的esm文件

```js
const dateFormat$1 = (date) => {
  console.log('dateFormat代码');
  return '2020-12-12';
};

const priceFormat$1 = (price) => {
  console.log('priceFormat代码');
  return '100.00';
};

var format = {
  dateFormat: dateFormat$1,
  priceFormat: priceFormat$1,
};

const { dateFormat, priceFormat } = format;
// import { sum, mul } from './js/math';

console.log(dateFormat('1213'));
// console.log(sum(1, 2));

var main = {

};

export { main as default };
```



打包后的cjs文件

```js
'use strict';

const dateFormat$1 = (date) => {
  console.log('dateFormat代码');
  return '2020-12-12';
};

const priceFormat$1 = (price) => {
  console.log('priceFormat代码');
  return '100.00';
};

var format = {
  dateFormat: dateFormat$1,
  priceFormat: priceFormat$1,
};

const { dateFormat, priceFormat } = format;
// import { sum, mul } from './js/math';

console.log(dateFormat('1213'));
// console.log(sum(1, 2));

var main = {

};

module.exports = main;
```


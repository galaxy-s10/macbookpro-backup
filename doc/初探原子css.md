# 前言

在讨论原子css的时候，首先我们先看看以前的css方案，看完之后再对比原子css的好处~

看之前可以看看css优先级：[https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)，对下文其实也挺重要的

# sass

## @import

Sass 扩展了 CSS 的[`@import`规则](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)，能够导入 Sass 和 CSS 样式表，提供对[mixins](https://sass-lang.com/documentation/at-rules/mixin)、[函数](https://sass-lang.com/documentation/at-rules/function)和[变量](https://sass-lang.com/documentation/variables)的访问，并将多个样式表的 CSS 组合在一起。与普通的 CSS 导入不同，后者要求浏览器在呈现页面时发出多个 HTTP 请求，Sass 导入完全在编译期间处理。

common.scss:

```scss
// flex的水平垂直居中
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 解决图片缩小模糊问题
.imgBlur {
  -ms-interpolation-mode: nearest-neighbor;

  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

// 单行省略号
.singleEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// ltr
.ltr {
  direction: ltr;
}

// rtl
.rtl {
  direction: rtl;
}

// 置灰
.grayscale {
  filter: grayscale(100%);
}

// float清除浮动
.clearfix {
  &:after {
    display: block;
    clear: both;
    content: '';
  }
}

```

index.scss:

```scss
@import './common.scss';
.header {
  width: 100px;
  @extend .singleEllipsis;
}
```

编译index.scss结果：

```css
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.imgBlur {
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.singleEllipsis, .header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ltr {
  direction: ltr;
}

.rtl {
  direction: rtl;
}

.grayscale {
  filter: grayscale(100%);
}

.clearfix:after {
  display: block;
  clear: both;
  content: "";
}

.header {
  width: 100px;
}
```

## extend

sass源码1（先定义要extend类，再使用）：

```scss
.singleEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clearfix {
  &:after {
    display: block;
    clear: both;
    content: '';
  }
}

.header {
  width: 100px;
  @extend .singleEllipsis;
  @extend .flexCenter;
  @extend .clearfix;
}
.logo {
  width: 50px;
  @extend .singleEllipsis;
  @extend .flexCenter;
  @extend .clearfix;
}
.footer {
  width: 100vw;
  @extend .singleEllipsis;
  @extend .flexCenter;
  @extend .clearfix;
}
```

sass源码1编译结果：

```css
.singleEllipsis, .footer, .logo, .header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flexCenter, .footer, .logo, .header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clearfix:after, .footer:after, .logo:after, .header:after {
  display: block;
  clear: both;
  content: '';
}

.header {
  width: 100px;
}

.logo {
  width: 50px;
}

.footer {
  width: 100vw;
}

```

> 编译结果跟顺序有关，有[css优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)问题
>
> 先定义要extend的类，再使用header，logo，footer的话，其实后面header，logo，footer的规则优先级比extend的高（不考虑!important）

sass源码2（先使用，再定义extend类）：

```scss
.header {
  width: 100px;
  @extend .singleEllipsis;
  @extend .flexCenter;
  @extend .clearfix;
}
.logo {
  width: 50px;
  @extend .singleEllipsis;
  @extend .flexCenter;
  @extend .clearfix;
}
.footer {
  width: 100vw;
  @extend .singleEllipsis;
  @extend .flexCenter;
  @extend .clearfix;
}

.singleEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clearfix {
  &:after {
    display: block;
    clear: both;
    content: '';
  }
}
```

sass源码2编译结果：

```css
.header {
  width: 100px;
}

.logo {
  width: 50px;
}

.footer {
  width: 100vw;
}

.singleEllipsis, .header, .logo, .footer {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flexCenter, .header, .logo, .footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clearfix:after, .header:after, .logo:after, .footer:after {
  display: block;
  clear: both;
  content: '';
}

```

> 编译结果跟顺序有关，有[css优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)问题
>
> header，logo，footer先试用了extend类，再定义extend类的话，其实后面的extend的类的优先级比header，logo，footer的高（不考虑!important）

## mixin

> mixin不允许先使用再定义，必须得先定义mixin，再使用。

sass源码：

```scss
@mixin singleEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin clearfix {
  &:after {
    display: block;
    clear: both;
    content: '';
  }
}

.header {
  width: 100px;
  @include singleEllipsis;
  @include flexCenter;
  @include clearfix;
}
.logo {
  width: 50px;
  @include singleEllipsis;
  @include flexCenter;
  @include clearfix;
}
.footer {
  width: 100vw;
  @include singleEllipsis;
  @include flexCenter;
  @include clearfix;
}
```

编译结果：

```css
.header {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header:after {
  display: block;
  clear: both;
  content: '';
}

.logo {
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo:after {
  display: block;
  clear: both;
  content: '';
}

.footer {
  width: 100vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer:after {
  display: block;
  clear: both;
  content: '';
}

```

> header，logo，footer的优先级比mixin的优先级高（不考虑!important）

## extend和mixin区别

从上面的结果来看很容易得出结论，mixin不会单独输出，它只是将一份样式复制到所有用到的地方里，而extend会单独输出，它是将单独输出的那一份样式共享给所有用到的地方。 

- extend不能接收参数，mixin可以接收参数
- mixin的造成的心智负担比extend的低很多（因为extend会根据书写的顺序不同会导致编译结果顺序也不同，有[css优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)优先级问题）
- 合理使用extend可以有效的复用样式，减少最终生成的css资源的大小。

## sass做不到很好的复用

在使用sass的过程中，我们有沉淀了一些常用的css类，如：

common.scss:

```scss
// flex的水平垂直居中
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 解决图片缩小模糊问题
.imgBlur {
  -ms-interpolation-mode: nearest-neighbor;

  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

// 单行省略号
.singleEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// ltr
.ltr {
  direction: ltr;
}

// rtl
.rtl {
  direction: rtl;
}

// 置灰
.grayscale {
  filter: grayscale(100%);
}

// float清除浮动
.clearfix {
  &:after {
    display: block;
    clear: both;
    content: '';
  }
}
```

我们可以通过extend来继承我们之前封装的类样式（至于为什么要用extend，而不是mixin，看上面的extend和mixin区别）：

```scss
.header {
  width: 100px;
  @extend .singleEllipsis;
}
```

这样咋眼一看，好像很正常，但是上面只是很泛的例子，实际的应用场景可能是这样的：

login.scss：

```scss
@import 'common.scss';

.header {
  width: 100px;
  @extend .singleEllipsis;
}

.fullname {
  width: 50px;
  @extend .singleEllipsis;
}
```

home.scss

```scss
@import 'common.scss';

.logo {
  width: 100px;
  @extend .imgBlur;
}

.avatar {
  width: 50px;
  @extend .imgBlur;
}
```

编译login.scss结果：

```css
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.imgBlur {
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.singleEllipsis, .fullname, .header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ltr {
  direction: ltr;
}

.rtl {
  direction: rtl;
}

.grayscale {
  filter: grayscale(100%);
}

.clearfix:after {
  display: block;
  clear: both;
  content: "";
}

.header {
  width: 100px;
}

.fullname {
  width: 50px;
}
```

编译home.scss结果：

```css
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.imgBlur, .avatar, .logo {
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.singleEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ltr {
  direction: ltr;
}

.rtl {
  direction: rtl;
}

.grayscale {
  filter: grayscale(100%);
}

.clearfix:after {
  display: block;
  clear: both;
  content: "";
}

.logo {
  width: 100px;
}

.avatar {
  width: 50px;
}
```

因为我们需要使用extend，所以我们就得引入common.scss，上面有两个文件引用到了common.scss，但是如果在一个项目里面，有五个十个甚至所有文件都引用了common.scss，那么我们编译这十几个文件的时候，每份文件都会引入所有的common.scss里面的样式，可能这个文件只用到了common.scss里面的一个样式，但是最终编译却会把common.scss的所有样式都会编译进每个样式文件里，很明显这造成了不必要的资源浪费（但是对这个文件或者sass来说，其实是正常的，因为你import了这个文件，他就会把这个文件的所有能引用的样式都引入进来），那么有没有办法只编译用到的类呢，其实是有的，使用占位符选择器能实现。

> 除了重复编译，还可能会造成污染，因为你common.scss里的所有类都会输出，里面的.flexCenter,.imgBlur等等类都有可能会污染全局的.flexCenter,.imgBlur，使用占位符选择器也能解决掉这个污染问题。

## 占位符选择器

具体解释：[https://sass-lang.com/documentation/style-rules/placeholder-selectors](https://sass-lang.com/documentation/style-rules/placeholder-selectors)，总的来说就是没被extend使用的占位选择器不会被输出。

使用占位符选择器修改common.scss:

```scss
// flex的水平垂直居中
%flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 解决图片缩小模糊问题
%imgBlur {
  -ms-interpolation-mode: nearest-neighbor;

  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

// 单行省略号
%singleEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// ltr
%ltr {
  direction: ltr;
}

// rtl
%rtl {
  direction: rtl;
}

// 置灰
%grayscale {
  filter: grayscale(100%);
}

// float清除浮动
%clearfix {
  &:after {
    display: block;
    clear: both;
    content: '';
  }
}
```

使用extend时也得用占位符选择器，login.scss:

```scss
@import 'common.scss';

.header {
  width: 100px;
  @extend %singleEllipsis;
}

.fullname {
  width: 50px;
  @extend %singleEllipsis;
}
```

编译login.scss结果：

```css
.fullname, .header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header {
  width: 100px;
}

.fullname {
  width: 50px;
}
```

可以看到，在使用占位选择器的时候，我们可以编译出只被extend使用过的类，这样就很好

## @keyframes

### 案例1

占位符选择器不会对@keyframes处理，@keyframes都会编译

animate.scss:

```scss
%animate-img {
  width: 100px;
  height: 100px;
  @keyframes img-flash-move {
    0% {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    100% {
      transform: translate(50%, 80%) rotate(45deg);
    }
  }
  animation: img-flash-move 1s infinite ease-out;
}
```

编译animate.scss结果：

```css
@keyframes img-flash-move {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  100% {
    transform: translate(50%, 80%) rotate(45deg);
  }
}
```

> 其他的属性没有被编译，@keyframes还是会被编译

### 案例2

animate.scss:

```scss
%animate-img {
  width: 100px;
  height: 100px;
  @keyframes img-flash-move {
    0% {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    100% {
      transform: translate(50%, 80%) rotate(45deg);
    }
  }
  animation: img-flash-move 1s infinite ease-out;
}

// 图片闪光
.img-flash {
  @extend %animate-img;
  @extend %animate-img;
}
```

编译的animate.scss结果:

```css
.img-flash {
  width: 100px;
  height: 100px;
  animation: img-flash-move 1s infinite ease-out;
}
@keyframes img-flash-move {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  100% {
    transform: translate(50%, 80%) rotate(45deg);
  }
}
```

> 在使用extend的时候，@keyframes定义在占位符选择器里的话，继承两次不会生成两个@keyframes。

### 案例3

animate.scss:

```scss
@mixin animate-img {
  width: 100px;
  height: 100px;
  @keyframes img-flash-move {
    0% {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    100% {
      transform: translate(50%, 80%) rotate(45deg);
    }
  }
  animation: img-flash-move 1s infinite ease-out;
}

```

编译animate.scss结果：

```css

```

>@keyframes在@mixin里的话，没有被@include就不会被编译。

### 案例4

animate.scss:

```scss
@mixin animate-img {
  width: 100px;
  height: 100px;
  @keyframes img-flash-move {
    0% {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    100% {
      transform: translate(50%, 80%) rotate(45deg);
    }
  }
  animation: img-flash-move 1s infinite ease-out;
}

// 图片闪光
.img-flash {
  @include animate-img;
  @include animate-img;
}

```

编译的animate.scss结果:

```css
.img-flash {
  width: 100px;
  height: 100px;
  animation: img-flash-move 1s infinite ease-out;
  width: 100px;
  height: 100px;
  animation: img-flash-move 1s infinite ease-out;
}
@keyframes img-flash-move {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  100% {
    transform: translate(50%, 80%) rotate(45deg);
  }
}
@keyframes img-flash-move {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  100% {
    transform: translate(50%, 80%) rotate(45deg);
  }
}
```

>在使用include的时候，@keyframes定义在占位符选择器里的话，include两次会生成两个@keyframes。因此在用mixin的时候，最好不要在里面定义@keyframes，而是在最外层定义@keyframes

### 案例5

animate.scss:

```scss
@keyframes img-flash-move {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  100% {
    transform: translate(50%, 80%) rotate(45deg);
  }
}

@mixin animate-img {
  width: 100px;
  height: 100px;
  animation: img-flash-move 1s infinite ease-out;
}

// 图片闪光
.img-flash {
  @include animate-img;
  @include animate-img;
}

```

编译的animate.scss结果:

```css
@keyframes img-flash-move {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  100% {
    transform: translate(50%, 80%) rotate(45deg);
  }
}
.img-flash {
  width: 100px;
  height: 100px;
  animation: img-flash-move 1s infinite ease-out;
  width: 100px;
  height: 100px;
  animation: img-flash-move 1s infinite ease-out;
}
```

> 在最外层定义@keyframes就没事

### 总结

貌似没有一个较好的办法来实现以下的效果

animate.scss

```scss
// 文字闪光
%text-flash {
  position: relative;
  overflow: hidden;
  @keyframes text-flash-move {
    0% {
      left: 0;
    }
    100% {
      left: 100%;
    }
  }
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 10%;
    height: 150%;
    background: white;
    content: '';
    opacity: 0.6;
    filter: blur(6px);
    transform: translateY(-20%) rotate(45deg);
    animation: text-flash-move 3s infinite ease;
  }
}
```

我希望在`@extend %text-flash;`的时候，才将`@keyframes text-flash-move`编译进去，而实际上并不能，只要引入了animate.scss，没有`@extend %text-flash;` 也会将`@keyframes text-flash-move` 编译进去。

而我们将占位符选择器换成mixin后，虽然能实现include的时候才编译`@keyframes text-flash-move` ，但是mixin的其实是复制操作，有多个地方用到了就会复制多份，`@keyframes text-flash-move` 也会复制多份，即使我们把`@keyframes text-flash-move` 提到最外层，那也会将其他的属性复制多份（而且如果将`@keyframes text-flash-move` 提到最外面的话，那还不如用占位运算符呢）。

综合考虑的话，其实上述总结里的animate.scss其实算是比较优的写法了，缺点就是如果没使用过`@keyframes text-flash-move` 也会生成一次`@keyframes text-flash-move` 

但是如果是只有一个sass文件，顶多就被引入一次无用的`@keyframes text-flash-move` ，但是如果我们在webpack环境里，使用sass-loader的方式处理sass，并且通过additionalData添加了这个%text-flash，那么每个sass文件都会生成这个多余的`@keyframes text-flash-move`，这岂不是更加的多重复的`@keyframes text-flash-move` ，得像个办法简化下，有两种办法

第一种就是additionalData不引入这个%text-flash，在用到的sass文件里面再单独的引入它，这样就可以避免了重复的`@keyframes text-flash-move` ，缺点就是在每个用到的sass文件都要引入它，而且，如果多个文件都引入了的话，其实还是会造成重复的`@keyframes text-flash-move` ，只是不会像additionalData添加%text-flash那样你没引入也会生成

第二种就是additionalData还是添加了%text-flash，但是我们把%text-flash里面的`@keyframes text-flash-move` 给提取出来成一个css或者scss文件，然后在我们项目的入口里引入一次它，这样就能满足需求了，既可以在所有的sass文件使用%text-flash，而且`@keyframes text-flash-move` 也只会生成一次。

但是，上述两种办法其实都还有一个缺点，就是优先级的问题，因为最终编译是类似这个样子的：

```html
<style>
    @keyframes aaa {
      0% {
        left: 10%;
      }
    }
  </style>
  <style>
    @keyframes aaa {
      0% {
        left: 10%;
      }
    }
  </style>
```

如果你多个源文件引入了同一个动画，那么最终其实就会生成多个style标签都带aaa这个动画，但实际上只会有一个aaa生效，上述的其实顶多就是重复引入，但如果你在一个文件里重写了aaa后，最终编辑的结果就不一样了，可能是：

```html
<style>
  @keyframes aaa {
    0% {
      left: 10%;
    }
  }
  @keyframes aaa {
    0% {
      left: 20%;
    }
  }
</style>
<style>
  @keyframes aaa {
    0% {
      left: 10%;
    }
  }
</style>
```

但是也可能是这样的：

```html
<style>
  @keyframes aaa {
    0% {
      left: 10%;
    }
  }
</style>
<style>
  @keyframes aaa {
    0% {
      left: 10%;
    }
  }
  @keyframes aaa {
    0% {
      left: 20%;
    }
  }
</style>
```

这是你可能就迷惑了，明明你重写了这个aaa动画，为什么他没有生效，因为你重写是重写了，但是后面还有样式使用了aaa，他的style标签生产了在你style标签后面，因此你重新的aaa就不生效，这个其实没啥好的办法解决，只能在readme里面写清楚所有通用的@keyframes规则，不要重写通用的@keyframes，或者说所有的@keyframes，都要保证只有一个，你在写@keyframes的时候，先全局搜一下你定义的@keyframes名字有没有别人写过了，如果别人用过这个@keyframes aaa了，你就别起@keyframes aaa了，起过另一个没人用过的@keyframes名字。

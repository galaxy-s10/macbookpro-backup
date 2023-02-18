# 父组件渲染导致子组件渲染

## 无优化

```tsx
import { memo, useState } from 'react';

const ChildCpt = () => {
  console.log('ChildCpt重新渲染了');

  return <div>ChildCpt</div>;
};

const FatherCpt = () => {
  const [count, setCount] = useState(1);

  console.log('FatherCpt重新渲染了');

  return (
    <div>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>setCount</button>
      <ChildCpt></ChildCpt>
    </div>
  );
};

export default memo(FatherCpt);
```

在没有任何优化的情况下，我们每点击一次 setCount 按钮，都会触发 FatherCpt 组件渲染，同时带动子组件 ChildCpt 也跟着渲染，在这个案例里面，很明显子组件是一个很纯的组件，即它没有依赖任何东西，其实它压根就没必要渲染，但是因为父组件渲染了，它也被迫进行了渲染，那么我们接下来就优化一下让 ChildCpt，让它不渲染

> 请别钻牛角尖，说这个场景为什么不把 ChildCpt 给直接写到 FatherCpt 里，这只是一个极简的例子，事实上只要是组件就会有渲染问题，和组件本身的大小无关

## React.memo 优化

最简单的优化就是 memo 了：

```tsx
import { memo, useState } from 'react';

const ChildCpt = memo(() => {
  console.log('ChildCpt重新渲染了');

  return <div>ChildCpt</div>;
});

const FatherCpt = () => {
  const [count, setCount] = useState(1);

  console.log('FatherCpt重新渲染了');

  return (
    <div>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>setCount</button>
      <ChildCpt></ChildCpt>
    </div>
  );
};

export default memo(FatherCpt);
```

给 ChildCpt 组件包一层 memo 后，再次点击 setCount 按钮，就不会触发 ChildCpt 组件重新渲染了

> 缺点：如果用了 react 的 eslint 配置，可能 [react/display-name](https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/display-name.md) 规则会报错，它要求 memo 里的函数需要有一个函数名，我们可以直接将 memo 里的箭头函数改成 function ChildCpt()就好了，但是看上去就怪怪的，或者我们可以单独的将 ChildCpt 抽离出去，然后通过 import 引入进来，这样可能好看点

## useMemo

```tsx
import { memo, useMemo, useState } from 'react';

const ChildCpt = () => {
  console.log('ChildCpt重新渲染了');
  return <div>ChildCpt</div>;
};

const FatherCpt = () => {
  const [count, setCount] = useState(1);
  console.log('FatherCpt重新渲染了');

  return (
    <div>
      <div>count:{count}</div>

      <button onClick={() => setCount(count + 1)}>setCount</button>

      {useMemo(
        () => (
          <ChildCpt></ChildCpt>
        ),
        []
      )}
    </div>
  );
};

export default memo(FatherCpt);
```

因为 ChildCpt 不依赖任何数据，因此 useMemo 的依赖数组就是空数组，这样点击 setCount，也不会触发 ChildCpt 组件重新渲染了

# 传参导致

## 无优化

```tsx
import { memo, useState } from 'react';

const ChildCpt = memo(() => {
  console.log('ChildCpt重新渲染了');

  return <div>ChildCpt</div>;
});

const FatherCpt = () => {
  const [count, setCount] = useState(1);

  console.log('FatherCpt重新渲染了');

  const sayhi = () => console.log('hi');

  return (
    <div>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>setCount</button>
      <ChildCpt callback={sayhi}></ChildCpt>
    </div>
  );
};

export default memo(FatherCpt);
```

每次点击 setCount 按钮，都会触发 ChildCpt 重新渲染

> 传给 ChildCpt 组件的 callback 参数，或许 ChildCpt 会根据它做一些操作，但是，这里是不需要关心的，因为只要父组件 FatherCpt 重新渲染了，就一定会带动子组件渲染，而且父组件重新渲染的时候，会重新定义一个新的 sayhi 函数，因此，就会传给 callback 的 sayhi 就会被认为是一个新的函数，就会导致 ChildCpt 重新渲染

## useCallback

```tsx
import { memo, useCallback, useState } from 'react';

const ChildCpt = memo(() => {
  console.log('ChildCpt重新渲染了');

  return <div>ChildCpt</div>;
});

const FatherCpt = () => {
  const [count, setCount] = useState(1);

  console.log('FatherCpt重新渲染了');

  const sayhi = useCallback(() => console.log('hi'), []);

  return (
    <div>
      <div>count:{count}</div>
      <button onClick={() => setCount(count + 1)}>setCount</button>
      <ChildCpt callback={sayhi}></ChildCpt>
    </div>
  );
};

export default memo(FatherCpt);
```

使用 useCallback 并且设置了依赖数组为空数组后，再次点击 setCount 按钮，FatherCpt 重新渲染了，但是不会导致 ChildCpt 重新渲染

# vue2源码

> 基于vue2.6.12

# 为什么用构造函数而不用class

> [https://github.com/vuejs/vue/issues/2371](https://github.com/vuejs/vue/issues/2371)

1. [vue-class-component](https://github.com/vuejs/vue-class-component) 插件可以实现class写法。
2. ES Classes 不能够满足当前 Vue.js 的需求，ES Classes 标准还没有完全规范化，并且总是朝着错误的方向发展。比如装饰器（decorators）至今只是**Stage**: 3阶段。
   1. Stage 0（初稿）
   2.  Stage 1（提案）
   3. Stage 2（草案）
   4. Stage 3（候选提案）
   5. Stage 4（过审提案）

# 注意

> 代码都是通过debugger进行调试。



# demo

只关心这部分代码，vue会做什么事情

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="app">
      {{test}}
      <h1>{{obj.name}}</h1>
      <h1>{{obj.age}}</h1>
    </div>
    <script src="./vue2.6.12.js"></script>
    <!-- <script src="https://unpkg.com/vue@2.6.12/dist/vue.js"></script> -->
    <script>
      debugger;
      var vm = new Vue({
        el: "#app",
        data() {
          return {
            test: 123,
            num: 456,
            obj: { name: "tom", age: 12 },
          };
        },
      });
    </script>
  </body>
</html>
```

# 测试

```ts
var vm = new Vue({
  el: "#app",
  data() {
    return {
      test: 123,
      obj: { name: "tom", age: 12 },
    };
  },
});
vm.data = {test:333}
```



# vue源码

```ts
function Vue(options) {
if (!(this instanceof Vue)) {
  warn("Vue is a constructor and should be called with the `new` keyword");
}
console.log("Vue的options", this, options);
  this._init(options);
}
console.log("开始执行一系列操作");
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
// ...
initGlobalAPI(Vue);
```

## 步骤1：_init

可以看到先执行了this._init(options)，\_init其实是在initMixin里面通过Vue.prototype.\_init进行了设置的，而且源码只有initMixin这个地方设置了\_init方法。那为什么这里在initMixin调用之前就可以执行\_init()方法？因为这个\_init方法是通过this调用的，他不是立即调用的，他是在通过Vue()或者new Vue()的时候，才会执行，而在导入Vue源码的时候（initMixin已经执行了，已经在Vue.prototype添加了\_init方法了），再执行new Vue()，此时\_init方法已经存在了。

## 步骤2：initMixin

```ts
function initMixin(Vue) {
  console.log("注意：开始执行一系列操作的initMixin");
  Vue.prototype._init = function (options) {
    console.log(
      "initMixin里面设置了Vue.prototype._init，这也是源码里面的唯一一次Vue.prototype._init",
      options
    );
		// ...
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, "beforeCreate");
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, "created");

    /* istanbul ignore if */
    if (config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure("vue " + vm._name + " init", startTag, endTag);
    }

    if (vm.$options.el) {
      console.log("注意：在initMixin里调用了vue实例的$mount", vm.$options.el);
      vm.$mount(vm.$options.el);
    }
  };
}
```

可以看到执行initMixin的时候，里面执行了一些初始化的事情：initLifecycle、initEvents、initRender、callHook(vm, "beforeCreate")等等，这里挑重点的看，initLifecycle、initEvents忽略，先看initRender

### 步骤2-1：initRender

```ts
function initRender(vm) {
    console.log(
      "-----------------------执行了initMixin里面的Vue.prototype._init里面的initRender"
    );
		// ....
    console.log("注意：给实例通过defineReactive添加$attrs和$listeners");
    {
      defineReactive$$1(
        vm,
        "$attrs",
        (parentData && parentData.attrs) || emptyObject,
        function () {
          !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
        },
        true
      );
      defineReactive$$1(
        vm,
        "$listeners",
        options._parentListeners || emptyObject,
        function () {
          !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
        },
        true
      );
    }
  }
```

#### initRender做了什么

给实例通过defineReactive添加$attrs和$listeners。

执行完initRender后，执行了beforeCreate的生命周期钩子，然后执行initInjections，注释写的resolve injections before data/props，即他是在初始化data和props前先处理了inject的数据，然后执行完initInjections后，开始执行initState

### 步骤2-2：initState

```ts
function initState(vm) {
  console.log(
    "-----------------------执行了initMixin里面的Vue.prototype._init里面的initState"
  );

  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) {
    initProps(vm, opts.props);
  }
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

#### initState做了什么

initProps、initMethods、initData、initComputed、initWatch，因此也可以看出一些options的属性优先级，prop最先执行，watch最后执行。这里直接看opts.data的判断，因为opts.data有值，所以直接进入了initData

#### 步骤2-2-1：initData

```ts
function initData(vm) {
  var data = vm.$options.data;
  data = vm._data =
    typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    warn(
      "data functions should return an object:\n" +
        "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          'Method "' + key + '" has already been defined as a data property.',
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      warn(
        'The data property "' +
          key +
          '" is already declared as a prop. ' +
          "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```



##### proxy

```ts
function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

###### proxy做了什么

数据代理，即通过Object.defineProperty将this.xxx代理到this.$data.xxx。

##### observe

```ts
function observe(value, asRootData) {
  console.log("注意：开始尝试给值创建观察者实例了", value);
  if (!isObject(value) || value instanceof VNode) {
    console.log(
      "注意：value不是一个对象或者value是一个VNode,直接不监听",
      value
    );
    return;
  }
  var ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    console.log(
      "注意：经过尝试后符合条件，开始给值创建观察者实例了new Observe(value)",
      value
    );
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

###### Observer

```ts
var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  console.log(
    "%c注意：开始new Dep()了",
    "color:red",
    value,
    this.dep,
    this.value
  );
  this.vmCount = 0;
  def(value, "__ob__", this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray(items) {
  console.log("注意：开始观察数组里的item", items);
  for (var i = 0, l = items.length; i < l; i++) {
    if (i == items.length - 1) {
      console.log("注意：观察数组里的item完成");
    }
    observe(items[i]);
  }
};
```

###### Dep

```ts
var Dep = function Dep() {
  console.log(
    "%c注意：有人new Dep了，现在已经进入了function Dep里面,有人new Dep即新建依赖",
    "color: blue"
  );
  this.id = uid++;
  this.subs = [];
};
Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  console.log("注意：有人执行了Dep的depend，开始收集依赖");
  if (Dep.target) {
    console.log(
      "注意：Dep.target有值，即watcher有值，开始调用Dep.target，即watcher的addDep"
    );
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (!config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) {
      return a.id - b.id;
    });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    console.log("注意：要开始update了", subs, subs[i]);
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
```

###### Observe和Dep做了什么

> 别忘了我们demo里面的data是{ test: 123, num: 456, obj: { name: "tom", age: 12 } }

1. Observe里面首先new Dep
2. 然后给改值添加了  `__ob__` ，即代表已经过observe处理
   1. 判断value是不是数组，是数组的话通过observeArray重写数组的方法。
   2. 不是数组，执行walk

###### walk

```ts
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};
```

###### defineReactive$$1

```ts
function defineReactive$$1(obj, key, val, customSetter, shallow) {
  console.log("%c注意：要在对象上定义响应式", "color:green", obj, key, val);
  var dep = new Dep();
  console.log("depdepdepdepdepdep", dep);
  dep.key = key;
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  console.log(
    "%c注意：开始使用Object.definedProperty了",
    "color:pink",
    obj,
    key
  );
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log("get", key);
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        console.log("注意：Dep.target有值，要开始收集依赖了", Dep.target);
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      } else {
        console.log("注意：Dep.target没有值，直接返回get的value");
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      console.log("set", newVal, customSetter, setter);
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        //如果新值和旧值一样，或者新值和旧值都是NaN
        return;
      }
      /* eslint-enable no-self-compare */
      if (customSetter) {
        console.log(
          "注意：set的时候发现customSetter有值，调用一下customSetter"
        );
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) {
        return;
      }
      if (setter) {
        console.log("注意：set的时候发现setter有值，调用一下setter");
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      childOb = !shallow && observe(newVal);
      console.log("注意：childOb", childOb);
      console.log("注意：要开始notify通知了");
      dep.notify();
    },
  });
}
```

###### walk和defineReactive$$1做了什么

> 别忘了我们demo里面的data是{ test: 123, num: 456, obj: { name: "tom", age: 12 } }

1. walk(value)，其实value就是{ test: 123, num: 456, obj: { name: "tom", age: 12 } }，里面通过Object.keys得到keys，然后遍历keys
2. 对每一项keys[i]进行defineReactive$$1(obj,val)，defineReactive$$1其实就是对{ test: 123, num: 456, obj: { name: "tom", age: 12 } }里面的属性进行Object.defineProperty处理，很明显defineReactive$$1在定义的时候接收接收5个参数，而现在执行的时候，只传了两个参数，即只传给了defineReactive$$1需要Object.defineProperty的obj和key，并没有传Object.defineProperty的value（其实是在遍历的调用defineReactive$$1(obj,val)的时候，把整个data对象也就是{ test: 123, num: 456, obj: { name: "tom", age: 12 } }当做了obj，把{ test: 123, num: 456, obj: { name: "tom", age: 12 } }里面的属性比如test当做了val。）

###### observe做了什么

1. observe只对普通对象进行处理，非对象或者vnode对象不处理。
2. 再判断有没有 `__ob__` 属性以及是否继承自Observer
   1. 如果满足条件，代表已经被observe处理过了，则将 `__ob__`  赋值给ob
   2. else if，继续判断，符合条件就ob = new Observer()
   3. Observer里面walk，其实是一个递归遍历的过程。
      1. 对{ test: 123, num: 456, obj: { name: "tom", age: 12 } }进行Object.defineProperty处理，把{ test: 123, num: 456, obj: { name: "tom", age: 12 } }作为Object.defineProperty的obj，对test和num作为Object.defineProperty的key，即test和num的变化能监听到了。
      2. 对{ test: 123, num: 456, obj: { name: "tom", age: 12 } }里面的test进行Object.defineProperty处理，把test作为Object.defineProperty的obj，test的值123作为Object.defineProperty的key，但是test的值不是对象，因此
      3. 把{ test: 123, num: 456, obj: { name: "tom", age: 12 } }里面的num作为根，进行Object.defineProperty处理，但是num的值不是对象，不进行Object.defineProperty处理。

##### initData做了什么

1. proxy数据代理
2. 将data的数据通过observe设置成了响应式。



### 步骤2-3：mounted

1. 在执行完initState后，接着执行了initProvide，注释写的resolve provide after data/props，即他是在initState后，处理了provide的数据
2. 然后调用了生命周期的created钩子函数。这个生命周期之后，就可以获取到data的数据了。

#### 步骤2-3-1：mountComponent

```ts
function mountComponent(vm, el, hydrating) {
  console.log("注意：开始调用mountComponent了");
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== "#") ||
        vm.$options.el ||
        el
      ) {
        warn(
          "You are using the runtime-only build of Vue where the template " +
            "compiler is not available. Either pre-compile the templates into " +
            "render functions, or use the compiler-included build.",
          vm
        );
      } else {
        warn(
          "Failed to mount component: template or render function not defined.",
          vm
        );
      }
    }
  }
  callHook(vm, "beforeMount");

  var updateComponent;
  /* istanbul ignore if */
  if (config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure("vue " + name + " render", startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure("vue " + name + " patch", startTag, endTag);
    };
  } else {
    updateComponent = function () {
      console.log("注意：updateComponent");
      // console.log(this.arr[0]);
      // debugger
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before: function before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, "mounted");
  }
  return vm;
}
```

##### mountComponent做了什么

1. 判断是否有render函数
2. 将template

## stateMixin

## eventsMixin

## lifecycleMixin

## renderMixin

## initGlobalAPI
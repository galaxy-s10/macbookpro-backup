# Verdaccio

[Verdaccio](https://verdaccio.org/)

业界主流的私有npm仓库搭建的主流方案有如下几种：

1. npm的私有仓库，收费：7$/month，而且npm在国内访问也很慢

2. git+ssh配合github的私有仓库，缺点：失去了semver版本控制的能力，要修改版本可以通过git tag实现。

   ```json
   "dependencies": {
     "typescript": "^4.7.4",
     "vue": "git+ssh://git@github.com:galaxy-s10/vue.git",
     "react": "git+ssh://git@github.com:galaxy-s10/react.git#v19.0.0",
   },
   ```

3. 自建私有仓库，和淘宝镜像差不多，只是使用的镜像是我们自己的镜像

# pm2启动

```sh
pm2 start verdaccio
```



## 配置文件

默认：/root/.config/verdaccio/config.yaml

# 最佳实践

[https://verdaccio.org/zh-CN/docs/best](https://verdaccio.org/zh-CN/docs/best)

```yaml
 yaml
  packages:
    '@my-company/*':
      access: $all
      publish: $authenticated
     'local-*':
      access: $all
      publish: $authenticated
    '@*/*':
      access: $all
      publish: $authenticated
    '**':
      access: $all
      publish: $authenticated
```

> 始终记住，包访问的顺序很重要，包总是从上到下加工。

即如果发布@my-company/cli这个包，



# 取消发布某个包

```sh
npm unpublish @billd/cli@0.0.14
# or取消发布所有版本
npm unpublish @billd/cli --force
```

# 注册用户

```sh
npm adduser --registry http://registry.hsslive.cn/
```



# 删除某个用户

既然有注册用户，不可避免的需求是在一些场景下，我们需要删除某个用户来禁止其登陆私有 npm 库。

前面也提及了 Verdaccio 默认使用的是 `htpasswd` 来实现鉴权。相应地，注册的用户信息会存储在 `~/.config/verdaccio/htpasswd` 文件中：





# lerna

> lerna主要用于依赖和版本管理

谁使用了lerna？

1. [create-react-app](https://github.com/facebook/create-react-app)，简称cra，从 `v0.5.0` 开始，直到目前的 `v5.0.1` 版本，使用了lerna。查看了其源码，发现其实都是主要利用了lerna的管理依赖功能（yarn workspaces），lerna.json的version值是independent，因此发布是的git commit 信息是默认的Publish，并且发布会带上所有发布的包的tag
2. [vue-cli](https://github.com/vuejs/vue-cli)，vue-cli从 `v3.0.0` 开始，直到目前的 `v5.0.8` 版本，使用了lerna，查看了其源码，发现vue-cli也是主要利用了lerna的管理依赖功能（yarn workspaces），在release操作上，vue-cli自己实现了一套release方案，lerna.json的version值是具体的一个版本号，因此发布只会带上这一个版本号的tag
3. [babel](https://github.com/babel/babel)，babel在 `6.x` 的时候使用了lerna（在7.x版本使用了yarn3.x），lerna.json的version值也是具体的一个版本号，因此发布也是只带一个版本号tag

## 注意

发布的时候可能会因为网络问题导致发包失败，这时注意看下本地的git tag、以及github和私服服务器的包版本是否一致

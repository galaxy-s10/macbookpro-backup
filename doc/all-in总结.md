# 我的服务器

nginx安装目录: /usr/local/webserver/nginx

jenkins安装目录: /var/lib/jenkins

移除服务器内置的监控：https://bdkp.net/40



vscode remote配置免密，将本机的/Users/huangshuisheng/.ssh/id_rsa.pub里面的内容：

```
ssh-rsa ssh-rsa AAAAB3NzaC1xxxxxx
```

复制粘贴到服务器的/root/.ssh/authorized_keys里面：

```
# mbp的秘钥
ssh-rsa AAAAB3NzaC1xxxxxx
```

即可免密登录



# js

## 阻止滚轮事件

```js
const xxx = document.getElementById('xxx')
xxx.addEventListener('wheel', e => {
  e.stopPropagation();
})
```

# korofileheader

mac快捷键

生成头部注释：control + command + i

生成函数注释：control + command + t

# 取消eslint、ts校验

```
eslint
/* eslint-disable */ # 在代码顶部添加一行注释

/* eslint-disable no-new */ # 还可以在注释后加入详细规则，这样就能避开指定的校验规则了

consle.log("foo"); // eslint-disable-line # 禁用当前行

// eslint-disable-next-line # 禁用下一行：
console.log("foo")

tslint
// tslint: disable 该行以下的内容都不再检查

// tslint: enable 为当前文件启动 tslint 检查

// tslint: disable-line 忽略当前行的错误提示

// tslint: disable-next-line 忽略下一行的错误提示

// tlint: disable-next-line: rule1 rule2 忽略下一行的 rule1 rule2 提示 多个规则之间使用空格分隔

typescript
// @ts-ignore # 忽视本行代码的小错误
// @ts-nocheck # 忽略全文
// @ts-check # 取消忽略全文
```



# yarn和npm

## 查看 npm 全局安装过的包

```sh
npm list -g --depth=0
```

## 查看 yarn 全局安装过的包

```sh
yarn global list --depth=0
```

## yarn装包

```sh
yarn add vue
yarn remove vue
yarn global remove vue
```

npm装包

```sh
npm i vue
npm uninstall vue
npm remove vue -g
```



# eslint

## 对下一行代码禁用eslint

```js
/* eslint-disable-next-line */
```

## 取消整个文件的校验

```js
/* eslint-disable */
```

## 取消指定规则的校验

这个是取消整个文件的，因此不管写在哪个位置都没影响，最好写在文件开头。

```js
/* eslint-disable no-unused-vars */
```



# nginx

安装nginx：https://www.runoob.com/linux/nginx-install-setup.html

删了error.log怎么办，重新执行nginx -s reload，就可以重新生成一个error.log

```nginx
# 这里的$uri是什么？如果请求localhost/aaa/123，$uri即/aaa/123。如果请求localhost/aaa/666，$uri即/aaa/666。
location /aaa/ {
    root /node/;
    try_files $uri $uri/ /$uri/index.html;
}
```

## 开机自启

> 貌似有点麻烦。

```sh
# 查看服务是否开机启动：
systemctl is-enabled nginx.service
# 查看服务是否运行
systemctl is-active nginx.service
```



```nginx
# 匹配/xxx/beat/或/xxx/preview/或/xxx/prod/,注意,前后都有/才能匹配到
location ~* ^\/([^\/]+)\/(beta|preview|prod)\/ {
    root /node/;
    try_files $uri /$1/$2/index.html;
}

# 匹配/xxx/,注意,前后都有/才能匹配到,匹配不了/xxx
location ~* ^\/([^\/]+)\/ {
    root /node/;
    try_files $uri /$1/index.html;
}
# ^~，只匹配以 uri 开头，匹配成功以后，会停止搜索后面的正则表达式匹配
location ^~ /api/ {
    proxy_pass http://localhost:3003/;
    # proxy_pass有/：www.hsslive.cn/api/ ===> http://localhost:3003/
    # proxy_pass没有/：www.hsslive.cn/api/ ===> http://localhost:3003/api/
}
```



# shell

查看当前发行版可以使用的shell

```bash
cat /etc/shells
```

条件判断：https://blog.csdn.net/zz153417230/article/details/117952372

## shell执行build

```shell
# 直接将它写进.env，然后可以在vue.config.js里面通过process.env找到VUE_APP_RELEASE_PUBLICPATH
# 但如果.env里面原本有其他环境变量的话，原本的其他的环境变量也会被覆盖了，
# echo VUE_APP_RELEASE_PUBLICPATH=$JOBNAME >.env
# npm run build

# 直接新建一个VUE_APP_RELEASE_PUBLICPATH.js文件，然后把文件名字给导出去，然后再到vue.config.js里面
# 加载这个文件，读这个文件里面的VUE_APP_RELEASE_PUBLICPATH
# echo "exports.VUE_APP_RELEASE_PUBLICPATH= \"$JOBNAME\";" >VUE_APP_RELEASE_PUBLICPATH.js
# npm run build

# 上面两种好像都不太优雅，会修改到文件，还有一种办法可以，
# 其实npm run build本质上就是 npx +script里面的build，即npx vue-cli-service serve
# 但是这样没办法使用cross-env注入变量，但是我们可以直接在shell里面执行!
# npx cross-env VUE_APP_RELEASE_PUBLICPATH=$JOBNAME vue-cli-service serve

# 上面npx的做法看似很好，但是其实还有一种做法：
npm run build VUE_APP_RELEASE_PUBLICPATH=$JOBNAME
# 这样执行之后，如果没报错的话，其实下面这几个地方找得到VUE_APP_RELEASE_PUBLICPATH
# process.argv,
# process.env.npm_lifecycle_script
# process.env.npm_package_scripts_build
# process.env.npm_config_argv
# 如果报错了，还是得使用npx的方法。
```



# jenkins

> 已设置开机自启。

```sh
#启动jenkins
service jenkins start
#重启jenkins
service jenkins restart
systemctl restart jenkins.service
#停止jenkins
service jenkins stop
```

我的gitee主页是[gitee.com/galaxy-s10](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fgalaxy-s10) ，但是我gitee是叫shuisheng，jenkins的gitee用户名是[gitee.com/galaxy-s10](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fgalaxy-s10) 里的galaxy-s10，而不是shuisheng

我的github主页是[github.com/galaxy-s10](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgalaxy-s10) ，但是我github是叫shuisheng，jenkins的github用户名就是shuisheng，而不是[github.com/galaxy-s10](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgalaxy-s10) 里的galaxy-s10....

## 区分环境

```groovy
if (BRANCH.equals("master")) {
  return ["null","beta","preview","prod"]
} else {
  return ["null","beta","preview"]
}
```

## 构建脚本

```bash
echo 当前路径: $(pwd)

echo 远程 URL（GIT_URL）: $GIT_URL

echo 被检出的提交哈希（GIT_COMMIT）: $GIT_COMMIT

echo 远程分支名称（GIT_BRANCH）: $GIT_BRANCH

echo 分支名（BRANCH_NAME）: $BRANCH_NAME

echo 此构建的项目名称（JOB_NAME）: $JOB_NAME

echo 当前项目工作空间的绝对路径（WORKSPACE）: $WORKSPACE

echo 当前构建的分支: $BRANCH

echo 当前发布的环境: $ENV

echo 当前node版本:

node -v

echo 当前npm版本:

npm -v

echo 开始执行构建脚本:

sh ./build.sh $JOB_NAME $ENV $WORKSPACE

echo 列出当前目录:

ls
```

```bash
sh /node/sh/frontend.sh $JOB_NAME $ENV $WORKSPACE
```



# mysql

> 已设置开机自启。

```bash
wget http://repo.mysql.com/mysql80-community-release-el8-2.noarch.rpm
rpm -ivh mysql80-community-release-el8-2.noarch.rpm
yum install mysql-server.x86_64
chown -R mysql:mysql /var/lib/mysql
mysqld --initialize
systemctl start mysqld.service

systemctl status mysqld #如果启动失败，看看是不是报权限不够
通过查看日志找到默认root密码：https://zhuanlan.zhihu.com/p/110261588

//首次先修改默认密码
alter user 'root'@'localhost' identified by '19990507aA..';
use mysql
//配置远程登录
update user set host = '%' where user ='root';
//刷新配置
flush privileges;

```

# Redis

> 已设置开机自启。

```
远程连接：
protected-mode yes改成protected-mode no
bind 127.0.0.1换行再加上bind 0.0.0.0

允许后台启动，将daemonize no改成daemonize yes
```



## 安装

```sh
yum install redis

redis-cli ping
看到pong就代表成功了
```

## 查看

```sh
# 查看redis运行状态
systemctl status redis.service

# 重启redis
systemctl restart redis.service

# 停止redis
systemctl stop redis.service

# 开机启动redis
systemctl enable redis.service

# 查看redis进程
ps -ef | grep redis
```

# systemctl

```sh
# 列出所有可用单元 
systemctl list-unit-files

# 列出所有运行中单元 
systemctl list-units

# 列出所有失败单元 
systemctl --failed

# 检查某个单元（如 crond.service）是否启用 
systemctl is-enabledcrond.service 

# 列出所有服务 
systemctl list-unit-files –type=service

# Linux中如何启动、重启、停止、重载服务以及检查服务（如 httpd.service）状态 
systemctl start httpd.service
systemctl restart httpd.service
systemctl stop httpd.service
systemctl reload httpd.service
systemctl status httpd.service

# 查看服务是否运行
systemctl is-active mysqld.service

# 开机自启
systemctl enable mysqld.service

# 关闭开机自启
systemctl disable mysqld.service

# 屏蔽服务 
systemctl mask ntpdate.service

# 取消屏蔽服务 
systemctl unmask ntpdate.service

# 查看服务是否开机启动：
systemctl is-enabled mysqld.service

# 使用systemctl命令杀死服务 
systemctl killcrond 
```







# node

## 安装

centos7环境：

```bash
yum install -y epel-release
/usr/bin/yum install -y nodejs
npm config set registry http://registry.npm.taobao.org/
node -v
npm -v
```

# pm2

> 已设置开机自启。

```sh
# 执行文件：
pm2 start app.js --name xxx
# npm操作，执行package.json里面的script的dev（注意先要进入到有package.json的项目目录里再执行）：
pm2 start npm --name xxx -- run dev
# 监控 CPU/内存
pm2 monit

# 保存列表
pm2 save
# 开机启动
pm2 startup
```

# Mac

## Mac查看端口占用并杀死进程

1.查询8080端口占用情况： lsof -i :端口号
2.杀死进程：kill -9 端口号

# mds_stores进程占用cpu

就是cmd+空格键触发的那个全局搜索，直接关掉吧

sudo mdutil -a -i off



## 软件

```shell
# 停掉Jenkins
service jenkins stop
# 使用rpm卸载Jenkins
rpm -e jenkins
# 检查是否卸载成功
rpm -ql jenkins
# 使用yum卸载Jenkins
yum -y remove jenkins
# 检查java版本
java -version

# Jenkins启动
systemctl start jenkins
systemctl status jenkins
systemctl enable jenkins
```

## 其他

https://ohse.de/uwe/software/lrzsz.html

# git

## git 修改.gitignore后生效

```sh
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

## 删除.DS_Store

查找所有.DS_Store文件：find .  -name '.DS_Store'

删除所有.DS_Store文件：find .  -name '.DS_Store' -depth -exec rm {} \;

## 修改remote

- 直接修改: git remote set-url origin xxxxx.git

- 先删后加 :先 git remote rm origin，然后git remote add origin xxxxx.git

## 文件名称大小写修改后，git无法检测出修改

-  git config –get core.ignorecase或者 git config core.ignorecase 查看当前是否开启 ignore大小写
- 可跳过第一步，直接 git config core.ignorecase false
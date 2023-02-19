安装 node

```sh
docker pull node:16.19.0
```

查看镜像

```sh
docker images
```

使用当前目录的 Dockerfile 创建镜像，名称为 vue3-blog-server-beta

```sh
docker build -t vue3-blog-server-beta .
```

删除镜像

```sh
docker rmi -f vue3-blog-server-beta
```

运行镜像

使用 `-d` 模式运行镜像将以分离模式运行 Docker 容器，使得容器在后台自助运行。开关符 `-p` 在容器中把一个公共端口导向到私有的端口，请用以下命令运行你之前构建的镜像：

```sh
docker run -p 3300:3300 -d vue3-blog-server-beta
```

```sh
docker run vue3-blog-server-beta
```

# 一些参数

## WORKDIR

为后面的 RUN、CMD、ENTRYPOINT、ADD、COPY 指令设置镜像中的当前工作目录。

## RUN

在容器中运行指令的命令。

## CMD

启动容器时运行指定的命令，Dockerfile 中可以有多个 CMD 指令，但只有最后一个生效，如果 docker run 后面指定有参数，该参数将会替换 CMD 的参数。

## ENTRYPOINT

同样，在 Dockerfile 中可以有多个 ENTRYPOINT 指令，也是只有最后一个生效，但与 CMD 不同的是，CMD 或 docker run 之后的参数会被当作参数传给 ENTRYPOINT。

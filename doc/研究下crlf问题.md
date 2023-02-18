.gitconfig

```
[core]
	#whitespace，true:显示空白问题；cr-at-eol:不显示空白问题
	#whitespace = true
	#whitespace = cr-at-eol

	#safecrlf,默认warn。true:拒绝提交包含混合换行符的文件；false:允许包含混合换行符的文件；warn:混合换行符的文件时报警告		
	#safecrlf = false
	#safecrlf = true
	#safecrlf = warn

	#autocrlf,默认false。false：不自动转换换行符；input：转换为LF；true：转换为CRLF
	#autocrlf = input
	#autocrlf = true
	#autocrlf = false
```



mac系统下的gitdemo

a.js

![https://resource.hsslive.cn/image/e648af774d624cc011f69c9d4ecccd66.jpg](https://resource.hsslive.cn/image/e648af774d624cc011f69c9d4ecccd66.jpg)

b.js

![https://resource.hsslive.cn/image/a524c477264e2cff46cf987a9bddaf0a.jpg](https://resource.hsslive.cn/image/a524c477264e2cff46cf987a9bddaf0a.jpg)

此时我们看到当前工作区是干净的，a.js和b.js都使用了LF作为尾行符，此时我们把代码提交上去github，然后换一台win系统的电脑拉代码下来

win系统的电脑.gitconfig配置和我mac的配置一样，拉取代码下来后，唯一不一样的是底部的LF变成了CRLF，这就很纳闷了，为什么我们mac系统里底部的显示LF，提交到git仓库后，按道理来说提交的文件也是LF，为啥我在win系统里面拉代码，底部没有显示文件是LF，而显示的是CRLF？？？先不管，此时我们保存a.js和b.js，按道理来说，原本文件是LF的话，此时我们在win系统里底部显示的是CRLF，保存的应该也是CRLF，git应该会检测出文件发生了修改，然而结果却是git并没有检测到更改了文件（此处省略图了，比较麻烦）。

这就又很纳闷了，？？？？？？，又先不管，我们此时在win系统新建一个c.js

c.js，c.js的尾行符是CRLF

```js
console.log('ccc')
```

直接提交代码仓库！然后回到mac，git pull拉下来

![https://resource.hsslive.cn/image/d6dd0df5900c1cf2fd797042a3e28b56.jpg](https://resource.hsslive.cn/image/d6dd0df5900c1cf2fd797042a3e28b56.jpg)

此时又纳闷了，明明win提交的c.js是crlf，为什么mac里拉代码下来，却还是显示的LF？？？暂且不管，直接保存一下c.js看看，发现和win的情况一样，git检测不到更改了文件，此时我们在mac添加一个.editorconfig文件：

.editorconfig

```
# https://editorconfig.org
root = true

[*]
end_of_line = lf

```

然后重新保存一遍所有文件，发现除了检测新增的.editorconfig文件，其他abc.js都检测不到修改（此时所有文件底部都是显示的LF），我们直接提交

然后回到win系统拉代码，拉代码下来后，所有文件的底部依旧显示的是CRLF，此时，将所有文件再保存一遍，此时有了变化，底部的CRLF全都变成了LF，注意，我们此时还没有使用git add添加到暂存区，仅仅是所有文件保存了一遍：

![https://resource.hsslive.cn/image/9a50c7cf72e0bddb34ebecf3e5ed7abe.png](https://resource.hsslive.cn/image/9a50c7cf72e0bddb34ebecf3e5ed7abe.png)

所有文件显示的都是：`No content changes found`，此时我们git diff显示：

![https://resource.hsslive.cn/image/4877b683757e62edaa17d93469f39115.png](https://resource.hsslive.cn/image/4877b683757e62edaa17d93469f39115.png)

翻译过了就是：`警告：在'b的工作副本中。js'，LF将在Git下次接触时被CRLF替换`，此时我们直接git add .看看会发生什么

![https://resource.hsslive.cn/image/cda67e6fd18822e4248a9526e03644d4.png](https://resource.hsslive.cn/image/cda67e6fd18822e4248a9526e03644d4.png)

![https://resource.hsslive.cn/image/165b0bac82045c25edbfae3ee369fcad.png](https://resource.hsslive.cn/image/165b0bac82045c25edbfae3ee369fcad.png)

很神奇的一点，git add .之后，竟然又恢复正常了？？？一脸懵逼，先放着这个问题，继续在win里面添加一个d.js看看

![https://resource.hsslive.cn/image/17508cf0ef4d69297ea5f5a40d73158d.png](https://resource.hsslive.cn/image/17508cf0ef4d69297ea5f5a40d73158d.png)

此时提交d.js，然后再到mac看看有没有什么异常，回到mac，拉了代码后，再次保存一遍所有文件，然后结果也是git没有检测修改，好像没什么毛病。

此时回到win系统，将.editorconfig文件的end_of_line修改为crlf，然后再保存一遍所有文件，看看，

![https://resource.hsslive.cn/image/d340831639571d00b220003c9ace4630.png](https://resource.hsslive.cn/image/d340831639571d00b220003c9ace4630.png)



![https://resource.hsslive.cn/image/712f543acd603bb9dd3b05528b698a34.png](https://resource.hsslive.cn/image/712f543acd603bb9dd3b05528b698a34.png)

看到.editorconfig只修改了一行，而a.js又显示了：`No content changes found`，b和c.js也是一样显示这个，但是问题来了，为什么d.js没有显示修改呢？？？？d.js和abc.js有啥不一样吗？让我们回顾上文，可以发现，ab是原本就是使用LF，添加.editorconfig配置文件后的格式化也是LF，c.js和d.js虽然都是在win创建的，但是c.js创建的时候是CRLF，后面在mac环境里，添加了.editorconfig后，格式化成LF了，而d.js一出生就是在有.editorconfig文件的时候，保存之后他变成了LF

此时还是没有说清楚abc和d.js有什么区别，这里我总结下其实有一个最大的区别：**abc.js都曾经在mac里面格式化过，然后提交到代码仓库，而且都被拉到了win，而d.js实际上只在win里面格式化过，并没有经过mac格式化后，再被win拉过来（这是d和c.js的区别）**

我们此时先git add .看看，应该还是和之前的一样，只会显示.editorconfig修改了，测试后果然是这样，只显示了.editorconfig修改了。然后我们新建一个e.js，然后再提交e.js

![https://resource.hsslive.cn/image/e43fca86adb82df5e659719b91ccd3c5.png](https://resource.hsslive.cn/image/e43fca86adb82df5e659719b91ccd3c5.png)



然后回到mac，先看看此时的mac：

![https://resource.hsslive.cn/image/6bfaa450afa59e6966e67dadf9e66365.png](https://resource.hsslive.cn/image/6bfaa450afa59e6966e67dadf9e66365.png)

所有文件底部都是显示LF，然后拉代码下来

![https://resource.hsslive.cn/image/f4fea5d1d368f4b069631660a728d6c9.png](https://resource.hsslive.cn/image/f4fea5d1d368f4b069631660a728d6c9.png)

可以看到，e.js包括所有文件，底部都还是显示LF，可以看出，编辑器貌似不管你.editorconfig设置的什么，他底下就是显示的LF（其实这跟"file.eol"这个vscode配置有关），编辑器其实是能读取文件的换行符的！！！！！编辑器其实是能读取文件的换行符的！！！！！编辑器其实是能读取文件的换行符的！！！！！编辑器其实是能读取文件的换行符的！！！！！编辑器其实是能读取文件的换行符的！！！！！因为提交到代码仓库的就是LF然后老规矩，保存所有文件看看

![https://resource.hsslive.cn/image/f9d68b279a8e318bb2e114144fba5061.png](https://resource.hsslive.cn/image/f9d68b279a8e318bb2e114144fba5061.png)

可以看出，保存一遍所有文件后，底部的LF变成了.editorconfig设置的CRLF，而且git检测除了空格差异，但是又有一点区别，只有abc.js检测出了空格差异，d和e都没有检测出空格差异，这其实还是上面那个区别，d和e没有在mac格式化过，都是一直在win系统，而abc都曾经在mac里面格式化成LF，因此，abc.js是LF，而de.js其实本质上还是CRLF，所以de在mac里面保持的时候，.editorconfig格式化成CRLF，和原本的不冲突，就不会有差异

我们此时git add .看看什么情况，

git add .后，和原本没git add .的情况一样，没变化，还是原本的空格差异，还是那几个文件，此时我们直接提交到git仓库

![https://resource.hsslive.cn/image/9e154798bccfa5396d3e80f61e507b2d.png](https://resource.hsslive.cn/image/9e154798bccfa5396d3e80f61e507b2d.png)



这里其实可以看到，已经很恶心了，明明什么都没有改，但是却又一堆飘红（空格差异），我们回到win，拉代码下来看看

![https://resource.hsslive.cn/image/9364be029d2caa0f472c52748ffc2138.png](https://resource.hsslive.cn/image/9364be029d2caa0f472c52748ffc2138.png)



真难看hhh，此时其实已经有一个小结论了，mac里面使用lf，在win里面即使保存文件的时候，会显示：`No content changes found`，但是git add .后，就不会显示了，因此最终提交到git仓库也不会有空格差异，而win里面使用crlf，在mac里保存文件，直接显示空格差异

最终提交代码也会有空格差异，非常的裂开呢，
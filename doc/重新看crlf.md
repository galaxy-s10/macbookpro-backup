.gitconfig

```
[core]
	#whitespace，true:显示空白问题；cr-at-eol:不显示空白问题
	#whitespace = true
	#whitespace = cr-at-eol

	#safecrlf,默认？？？。true:拒绝提交包含混合换行符的文件；false:允许包含混合换行符的文件；warn:混合换行符的文件时报警告		
	#safecrlf = false
	#safecrlf = true
	#safecrlf = warn

	#autocrlf,默认？？？。false：不自动转换换行符；input：转换为LF；true：转换为CRLF
	#autocrlf = input
	#autocrlf = true
	#autocrlf = false
```

mac下的a.js

![image-20221117上午102720497](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午102720497.png)



mac下的b.js

![image-20221117上午102740562](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午102740562.png)



git 状态

![image-20221117上午102802506](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午102802506.png)



![image-20221117上午102811063](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午102811063.png)



此时`git add .`  添加到暂存区

此时的工作区

![image-20221117上午102916704](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午102916704.png)

![image-20221117上午102928901](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午102928901.png)

此时的git提交状态：

![image-20221117上午102952312](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午102952312.png)



![image-20221117上午103005131](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午103005131.png)



我们可以看到，提交到代码仓库的代码，在文件的最后面还添加了一个  ` \ No newline at end of file` ，此时我们继续`git commit -m 1` 将当前代码提交到代码仓库

![image-20221117上午103200008](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午103200008.png)

此时就会有一个历史记录：
![image-20221117上午103229271](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午103229271.png)

可以看到` \ No newline at end of file` 也在历史记录里面。



此时我们将a.js的LF换成CRLF并且保存一遍a.js试试

![image-20221117上午103408891](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午103408891.png)



此时的git状态

![image-20221117上午103611387](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午103611387.png)



git diff看看：

![image-20221117上午103639522](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午103639522.png)

可以看到，git检测出了区别，也就是^M

git add后的状态：

![image-20221117上午103658639](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午103658639.png)



继续执行`git commit 2`

![image-20221117上午103800603](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午103800603.png)

可以看到，我们的a.js因为一开始是使用LF的，后面改成CRLF保存后，就会有差异，并且，当前的代码仓库同时拥有了CRLF(a.js)和LF(b.js)，感觉有点别扭，能不能只拥有一种

此时我们如果希望让a.js即使使用了CRLF，也不和原本的LF冲突，我们可以设置autocrlf = input，这样的话，我们原本是使用LF的，将它改成了CRLF的话，他在git add的时候，会提示`warning: xxx 中的 CRLF 将被 LF 替换。<在工作区中该文件仍保持原有的换行符。`

此时我们设置autocrlf = input后，将原本是LF的b.js改成CRLF并且保存

git diff

![image-20221117上午110256557](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午110256557.png)



git status

![image-20221117上午110350943](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午110350943.png)

![image-20221117上午110333806](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午110333806.png)

git add .

![image-20221117上午110418322](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午110418322.png)

可以看到，git add后，显示了警告信息，然后什么也没改动，可以看出来，当前工作区的b.js是使用了CRLF，但是提交到暂存区的b.js的CRLF被git替换成了LF，但是并没有改工作区里面b.js的换行符。

a.js（LF），b.js（LF）===> a.js（CRLF），b.js（LF），没有设置autocrlf = input，因此a.js会检查出尾号差异

a.js（CRLF），b.js（LF）===> a.js（CRLF），b.js（CRLF），设置了autocrlf = input，b.js虽然工作区里换成了CRLF，但是提交到暂存区的b.js却还是LF，因此没有检测出尾号差异

总结下当前的逻辑：

1. a.js（LF），b.js（LF）===> a.js（CRLF），b.js（LF），没有设置autocrlf = input，因此a.js会检查出尾号差异
2. a.js（CRLF），b.js（LF）===> a.js（CRLF），b.js（CRLF），设置了autocrlf = input，b.js虽然工作区里换成了CRLF，但是提交到暂存区的b.js却还是LF，因此没有检测出尾号差异

第一种情况是本地无git配置，因此只要原本文件是LF的后面被你改成CRLF了，就会检测出差异

第二种情况是本地git配置了autocrlf = input，因此源文件是是LF的，改成了CRLF后，会在git add的时候不修改工作区的b.js的CRLF，但是修改提交到暂存区的b.js为LF，因为b.js原本就是LF，提交到暂存区的b.js还是LF，因此不会检测出差异。

此时我们新增一个c.js，并且设置他是LF的，然后保存并且提交

![image-20221117上午113017473](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午113017473.png)

提交后，我们修改c.js为CRLF，并且保存

![image-20221117上午113110901](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午113110901.png)



![image-20221117上午113122214](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午113122214.png)

行为和原本的b.js一致，没问题。

那么此时也就是说本地工作区的c.js还是使用CRLF，我们将它改为LF保存看看

![image-20221117上午113251814](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午113251814.png)

git add .

![image-20221117上午113306549](/Users/huangshuisheng/Library/Application Support/typora-user-images/image-20221117上午113306549.png)

可以看到，如果我们将c.js保存为LF后，虽然git stattus会显示修改了，但是git add .添加到暂存区后，照样是没有检测出差异的，以为在暂存区的c.js就是使用的LF，本地的c.js当然是检测不出差异

> **这就说明了，设置autocrlf = input会导致，不管你本地使用LF还是CRLF，最终提交到暂存区的时候都会转换为LF，即你本地的换行符差异最终不会被提交到代码仓库！**

现在ab是CRLF，c是LF，autocrlf = input，我们修改autocrlf = true，我们把代码提交，然后再win系统拉代码下来，并且在win系统新建一个d.js，它的换行符使用LF，然后保存后提交，回到mac里面拉代码

我们此时可以使用git配置safecrlf来约束，设置safecrlf = true后，此时我们再添加一个c.js，c.js使用LF
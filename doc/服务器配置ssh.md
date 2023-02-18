# 服务器配置ssh

成功连接服务器后，输入：

```sh
ssh-keygen
```

可以看到结果：

```sh
[root@VM-12-2-centos .ssh]# ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:5GotD3k4RGUz5CjGh8lqpya4WvQkSCLv3CjRNXCVEYc root@VM-12-2-centos
The key's randomart image is:
+---[RSA 3072]----+
|  . ..+*B        |
|   = oE* o       |
|o.  X + o        |
|++ + = o         |
|o B o . S        |
|.* O . =         |
|+ B o O o        |
| *   . *         |
|+       .        |
+----[SHA256]-----+
[root@VM-12-2-centos .ssh]#
```


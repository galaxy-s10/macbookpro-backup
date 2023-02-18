# 缘由

博客原本的接口：

前台：https://www.hsslive.cn/prodapi/或者https://www.hsslive.cn/betaapi/，通过nginx的服务代理到真实的接口的

后台：https://admin.hsslive.cn/prodapi/或者https://admin.hsslive.cn/betaapi/，通过admin配置的nginx服务代理到真实的接口



# nginx

```
user root;
worker_processes 1;

events {
  worker_connections 1024;
}


http {
  # 允许最大上传的大小
  client_max_body_size 50m;
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;


  # 多个server需要每个listen都写端口号，不写listen的话貌似也没问题？实际测试不写80端口的会找对应的server_name
  # hsslive.cn 80端口
  server {
    listen 80;
    server_name hsslive.cn;

    location / {
      # 把当前域名的请求，跳转到新域名上，域名变化但路径不变，permanent：返回301永久重定向，浏览器地址栏会显示跳转后的URL地址
      rewrite ^/(.*) https://www.hsslive.cn/$1 permanent;
    }
  }

  # www.hsslive.cn 80端口
  server {
    listen 80;
    server_name www.hsslive.cn;

    location / {
      # 把当前域名的请求，跳转到新域名上，域名变化但路径不变，permanent：返回301永久重定向，浏览器地址栏会显示跳转后的URL地址
      rewrite ^/(.*) https://www.hsslive.cn/$1 permanent;
    }
  }

  # api.hsslive.cn 80端口
  server {
    listen 80;
    server_name api.hsslive.cn;

    location / {
      # 把当前域名的请求，跳转到新域名上，域名变化但路径不变，permanent：返回301永久重定向，浏览器地址栏会显示跳转后的URL地址
      rewrite ^/(.*) https://api.hsslive.cn/$1 permanent;
    }
  }

  # admin.hsslive.cn 80端口
  server {
    listen 80;
    server_name admin.hsslive.cn;

    # location / {
    #     root /node/vue3-blog-admin;
    #     index index.html index.htm;
    #     try_files $uri $uri/ /index.html;
    # }

    # location /api/ {
    #     proxy_pass http://localhost:3200/;
    # }
    location / {
      # 把当前域名的请求，跳转到新域名上，域名变化但路径不变，permanent：返回301永久重定向，浏览器地址栏会显示跳转后的URL地址
      rewrite ^/(.*) https://admin.hsslive.cn/$1 permanent;
    }
  }

  # project.hsslive.cn 80端口
  server {
    listen 80;
    server_name project.hsslive.cn;

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;

    # root /node/;
    # index index.html index.htm;

    location = /lang/ {
      # 请求localhost/xxx/,会请求到服务器的/node/xxx/index.html
      # zh-tw（台湾）,zh-hk（香港）,zh-mo（澳门）,zh-hant和zh-cht(繁体)
      if ($http_accept_language ~* ^zh-(TW|HK|MO|Hant|CHT)) {
        # 请求localhost/xxx/,会请求到服务器的/node/xxx/index.html
        return 301 http://lang.hsslive.cn/tw/;
      }
      # zh-Hans，简体中文，适用区域范围是全宇宙用中文简体的地方，内容包括各种用简体的方言等。
      # zh-CN，简体中文，中国大陆区域的中文。包括各种大方言、小方言、繁体、简体等等都可以被匹配到。
      if ($http_accept_language ~* ^zh-(CN|Hans)) {
        return 301 http://lang.hsslive.cn/ch/;
      }
      # 英语
      if ($http_accept_language ~* ^en) {
        return 301 http://lang.hsslive.cn/en;
      }
      # 韩文
      if ($http_accept_language ~* ^ko) {
        return 301 http://lang.hsslive.cn/ko;
      }
      # 日语
      if ($http_accept_language ~* ^ja) {
        return 301 http://lang.hsslive.cn/ja;
      }
    }

    location / {
      # 请求localhost/xxx/,会请求到服务器的/node/xxx/index.html
      root /node/;
      index index.html index.htm;
    }
    # location /aaa/ {
    #     #root /node/; #不能这样了，如果这样的话，/aaa/时，实际访问的是node目录里面的aaa目录。
    #     alias /node/; #这样的话，访问/aaa/时，实际访问的就是/node/目录
    #     index index.html index.htm;
    #     try_files $uri $uri/ /index.html;
    # }
    # 匹配/xxx/,注意，前后都有/才能匹配到,匹配不了/xxx
    # location ~* ^\/([^\/]+)\/ {
    #     # 请求localhost/xxx/,会请求到服务器的/node/xxx/index.html
    #     root /node/;
    #     try_files $uri /$1/index.html;
    # }
    location ^~ /api/ {
      # default_type application/json ;
      # return 200 http://hsslive.cn/api;
      proxy_redirect off;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header Host1 $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://localhost:3300/;
    }
    location ^~ /betaapi/ {
      # default_type application/json ;
      # return 200 http://hsslive.cn/api;
      proxy_redirect off;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header Host1 $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://localhost:3300/;
    }
    location ^~ /prodapi/ {
      # default_type application/json ;
      # return 200 http://hsslive.cn/api;
      proxy_redirect off;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header Host1 $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://localhost:3200/;
    }

    # 匹配/xxx/beta/等,注意，前后都有/才能匹配到
    location ~* ^\/([^/]+)\/(beta|preview|prod)\/ {
      # 请求localhost/beta/,会请求到服务器的/node/beta/index.html
      root /node/;
      try_files $uri /$1/$2/index.html;
    }

    # 匹配/xxx/,注意，前后都有/才能匹配到,匹配不了/xxx/
    location ~* ^\/([^/]+)\/ {
      # 请求localhost/xxx/,会请求到服务器的/node/xxx/index.html
      root /node/;
      try_files $uri /$1/index.html;
    }
  }

  # lang.hsslive.cn 80端口
  server {
    listen 80;
    server_name lang.hsslive.cn;

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;

    location / {
      # 请求localhost/xxx/,会请求到服务器的/node/xxx/index.html
      root /node/lang/;
      index index.html index.htm;
    }
  }

  # jenkins.hsslive.cn 80端口
  server {
    listen 80;
    server_name jenkins.hsslive.cn;

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;

    location / {
      proxy_pass http://localhost:8080/;
    }
  }

  # registry.hsslive.cn 80端口
  server {
    listen 80;
    server_name registry.hsslive.cn;

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;

    location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_redirect off;
      proxy_pass http://localhost:4873/;
    }
  }

  # next.hsslive.cn 80端口
  server {
    listen 80;
    server_name next.hsslive.cn;

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;

    location / {
      proxy_pass http://localhost:4000/;
    }
  }

  # api.hsslive.cn 443端口
  server {
    listen 443 ssl;
    server_name api.hsslive.cn;

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;

    # https://cloud.tencent.com/document/product/400/47360
    ssl_certificate /usr/local/webserver/nginx/conf/cert/api.hsslive.cn_bundle.crt;
    ssl_certificate_key /usr/local/webserver/nginx/conf/cert/api.hsslive.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TlSv1.1 TLSv1.2;
    ssl_ciphers SM2-WITH-SMS4SM3:ECDH:AESGCM:HIGH:MEDIUM:!RC4:!DH:!MD5:!aNULL:!eNULL;
    ssl_prefer_server_ciphers on;

    # https://www.cnblogs.com/shouke/p/15511149.html
    location /prodapi/ {
      proxy_redirect off;
      # $remote_addr代表客户端IP，这里的客户端指的是直接请求Nginx的客户端，非间接请求的客户端（即不管中转了几次，都是拿到最上层的用户IP）。给koa用
      # X-Real-IP为请求头名称，可自定义
      proxy_set_header X-Real-IP $remote_addr;
      # $proxy_add_x_forwarded_for用来追踪请求的来源：clientIP, proxyIP1, proxyIP2，最左边的clientIp即为客户端真实IP
      proxy_set_header X-Forwarded-For arded_for;
      # $host 浏览器请求的ip，不显示端口号
      proxy_set_header X-Http-Host $http_host;
      # $http_host 浏览器请求的ip和端口号（如果没有端口号则不显示）
      proxy_set_header X-Host $host;
      # proxy_set_header aaaa $https; # $https 如果开启了SSL安全模式，值为“on”，否则为空字符串。
      # proxy_set_header X-NginX-Proxy true;
      # $scheme 请求使用的Web协议, http 或 https
      proxy_set_header X-Forwarded-Proto $scheme; # https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Forwarded-Proto
      proxy_pass http://localhost:3200/;
    }

    location /betaapi/ {
      proxy_redirect off;
      # proxy_set_header #设置由后端的服务器获取用户的主机名或者真实IP地址，以及代理者的真实IP地址。

      # $remote_addr是真实ip，传递给koa用
      proxy_set_header X-Real-IP $remote_addr;
      # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      # proxy_set_header Host $http_host;
      # proxy_set_header Host1 $host;
      # proxy_set_header X-NginX-Proxy true;
      # https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Forwarded-Proto
      proxy_set_header X-Forwarded-Proto https;
      proxy_pass http://localhost:3300/;
    }
  }

  # www.hsslive.cn和admin.hsslive.cn都是443端口，为啥代码到https://hsslive.cn，就会代理到https://www.hsslive.cn？
  # 实测证明，如果注释掉https的www.hsslive.cn，只留一个https的admin.hsslive.cn，https://hsslive.cn还是会代理到https://www.hsslive.cn，但是显示的内容却是admin.hsslive.cn的
  # 可以用postman测试。不要用浏览器测试，因为浏览器可能存在dns缓存等问题。
  # www.hsslive.cn 443端口
  server {
    #SSL协议访问端口号为443。此处如未添加ssl，可能会造成Nginx无法启动。
    listen 443 ssl;
    server_name www.hsslive.cn;

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;
    # https://cloud.tencent.com/document/product/400/47360
    ssl_certificate /usr/local/webserver/nginx/conf/cert/www.hsslive.cn_bundle.crt;
    ssl_certificate_key /usr/local/webserver/nginx/conf/cert/www.hsslive.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TlSv1.1 TLSv1.2;
    ssl_ciphers SM2-WITH-SMS4SM3:ECDH:AESGCM:HIGH:MEDIUM:!RC4:!DH:!MD5:!aNULL:!eNULL;
    ssl_prefer_server_ciphers on;

    location / {
      proxy_redirect off;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header Host1 $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://localhost:3000/;
    }
    location /socket.io/ {
      proxy_redirect off;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header Host1 $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection Upgrade;
      proxy_pass http://localhost:3200/socket.io/;
    }
    # location /prodapi/ {
    #   proxy_redirect off;
    #   proxy_set_header X-Real-IP $remote_addr;
    #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #   proxy_set_header Host $http_host;
    #   proxy_set_header Host1 $host;
    #   proxy_set_header X-NginX-Proxy true;
    #   proxy_pass http://localhost:3200/;
    # }
    # location /betaapi/ {
    #   proxy_redirect off;
    #   proxy_set_header X-Real-IP $remote_addr;
    #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #   proxy_set_header Host $http_host;
    #   proxy_set_header Host1 $host;
    #   proxy_set_header X-NginX-Proxy true;
    #   proxy_pass http://localhost:3300/;
    # }
  }

  # hsslive.cn 443端口
  server {
    #SSL协议访问端口号为443。此处如未添加ssl，可能会造成Nginx无法启动。
    listen 443 ssl;
    server_name hsslive.cn;

    # WARN 这里虽然仅仅作为重定向使用，但是仍然需要配置ssl证书，
    # 否则nuxt或者next在请求https://hsslive.cn/prodapi/tag/list/会报错误:Hostname/IP does not match certificate's altnames
    # 而且没配置ssl证书的话，在浏览器首次请求https://hsslive.cn/prodapi/tag/list/时，也会提示不安全（但是仍然可以点确定然后拿到数据，
    # nuxt或者next应该也是因为这个导致报错的）

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;

    # https://cloud.tencent.com/document/product/400/47360
    ssl_certificate /usr/local/webserver/nginx/conf/cert/www.hsslive.cn_bundle.crt;
    ssl_certificate_key /usr/local/webserver/nginx/conf/cert/www.hsslive.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TlSv1.1 TLSv1.2;
    ssl_ciphers SM2-WITH-SMS4SM3:ECDH:AESGCM:HIGH:MEDIUM:!RC4:!DH:!MD5:!aNULL:!eNULL;
    ssl_prefer_server_ciphers on;

    location / {
      # 把当前域名的请求，跳转到新域名上，域名变化但路径不变，permanent：返回301永久重定向，浏览器地址栏会显示跳转后的URL地址
      rewrite ^/(.*) https://www.hsslive.cn/$1 permanent;
    }

    # WARN ===这里不匹配/prodapi/和/betaapi/，仅仅将https://hsslive.cn重定向到https://www.hsslive.cn===
    # 即请求https://hsslive.cn/prodapi/tag/list/就会重定向到https://www.hsslive.cn/prodapi/tag/list/
    # 但是注意：如果在浏览器发起xhr请求https://hsslive.cn/prodapi/tag/list/，会得到一个301重定向结果，拿不到数据！
    # 这是直接在浏览器地址栏访问https://hsslive.cn/prodapi/tag/list/，就会重定向到https://www.hsslive.cn/prodapi/tag/list/，可以拿到数据
    # !!!!!!!!!!!!!!接口服务请调用api.hsslive.cn!!!!!!!!!
  }

  # admin.hsslive.cn 443端口
  server {
    # SSL协议访问端口号为443。此处如未添加ssl，可能会造成Nginx无法启动。
    listen 443 ssl;
    server_name admin.hsslive.cn;

    # 开启gzip，关闭用off
    gzip on;
    # 选择压缩的文件类型，其值可以在 mime.types 文件中找到。
    gzip_types text/plain text/css application/json application/javascript
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，推荐6
    gzip_comp_level 6;

    # https://cloud.tencent.com/document/product/400/47360
    ssl_certificate /usr/local/webserver/nginx/conf/cert/admin.hsslive.cn_bundle.crt;
    ssl_certificate_key /usr/local/webserver/nginx/conf/cert/admin.hsslive.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TlSv1.1 TLSv1.2;
    ssl_ciphers SM2-WITH-SMS4SM3:ECDH:AESGCM:HIGH:MEDIUM:!RC4:!DH:!MD5:!aNULL:!eNULL;
    ssl_prefer_server_ciphers on;

    location / {
      proxy_redirect off;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header Host1 $host;
      proxy_set_header X-NginX-Proxy true;

      root /node/vue3-blog-admin;
      index index.html index.htm;
      try_files $uri $uri/ /index.html;
    }

    # location /prodapi/ {
    #   proxy_redirect off;
    #   proxy_set_header X-Real-IP $remote_addr;
    #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #   proxy_set_header Host $http_host;
    #   proxy_set_header Host1 $host;
    #   proxy_set_header X-NginX-Proxy true;
    #   proxy_set_header X-Forwarded-Proto https;
    #   # proxy_pass http://42.193.157.44:3200/admin/;
    #   proxy_pass http://localhost:3200/admin/;
    # }
    # location /betaapi/ {
    #   proxy_redirect off;
    #   proxy_set_header X-Real-IP $remote_addr;
    #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #   proxy_set_header Host $http_host;
    #   proxy_set_header Host1 $host;
    #   proxy_set_header X-NginX-Proxy true;
    #   proxy_set_header X-Forwarded-Proto https;
    #   # proxy_pass http://42.193.157.44:3300/admin/;
    #   proxy_pass http://localhost:3300/admin/;
    # }
  }
}

```


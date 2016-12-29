# webpack-seed

基于webpack搭建纯静态页面型前端工程解决方案模板。


### 安装软件

- Node.js：v5.0+


### 拷贝项目模板

``` bash
$ git clone http://chendong@10.238.253.8:10100/r/Generator-MultiPage.git
```


### 安装依赖模块

``` bash
$ npm install -g gulp webpack
$ npm install -g node-dev # 推荐这个工具，代码改动会自动重启node进程
$ cd webpack && npm install
```

### 本地开发环境

- 启动本地开发服务器

    ``` bash
    $ npm run dev-comps // 组件开发
    $ npm run dev-pages // 页面开发
    ```

### 业务开发

##### 目录结构

``` js
.
├── gulpfile.js                    # gulp任务配置
├── mock/                          # 假数据文件
├── package.json                   # 项目配置
├── README.md                      # 项目说明
├── configs                        # 项目配置
│   ├── environments               # 环境配置
│   │   ├── dependencies.js        # 项目依赖
│   │   └── index.js               # 项目环境变量
│   ├── karam/                     # 单元测试配置文件
│   ├── webpack                    # webpack配置文件
│   └── webpack-dev-middleware/    # webpack开发中间件配置
├── server                         # 本地server
│   ├── app.js                     # 本地server入口
│   ├── home.jade                  # 列出项目所有入口文件、组件、自定义插件
│   ├── error.jade                 # 错误显示模板
│   └── routes.js                  # 本地路由配置
└── src                            # 源码目录
    ├── a.html                     # 页面入口a
    ├── b.html                     # 页面入口b
    ├── c.html                     # 页面入口c
    ├── css/                       # css资源
    ├── img/                       # 图片资源
    ├── scripts                    # js资源
    │   ├── apis/                  # 异步请求文件
    │   ├── components/            # 组件
    │   ├── helpers/               # 业务相关的辅助工具
    │   ├── map/                   # 数据类型的映射表
    │   ├── model/                 # 组件的数据模型
    │   ├── pages/                 # 入口文件
    │   ├── plugins/               # 自定义插件
    │   ├── utils/                 # 业务无关的辅助工具
    │   └── vendor/                # 没有存放在npm的第三方库或者下载存放到本地的基础库，如jQuery、Zepto、React等
    ├── less/                      # less资源
    ├── pathmap.json               # 手动配置某些模块的路径，可以加快webpack的编译速度
    └── tmpl/                      # 模板目录
```

### 编译

``` bash
$ npm run build
```

### 模拟生产环境

``` bash
$ npm run start-release
```

### 部署&发布

纯静态页面型的应用，最简单的做法是直接把`assets`文件夹部署到指定机器即可（先配置好机器ip、密码、上传路径等信息）：

``` js
$ npm run deploy # or run `gulp deploy`
```

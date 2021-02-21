# 基于Vue3.x+TypeScript +Element Plus整合开发的在线教育平台后台管理系统（后台前端源码） 

> 后台预览地址 , **[http://cms.xueden.cn/](http://cms.xueden.cn/)** 。
>
> 测试账号：test02
>
> 测试密码：123456
>
> 前台预览地址： **[http://www.xueden.cn/](http://www.xueden.cn/)** 。
>
> QQ群交流：601212472



## 后端源码地址

**[https://github.com/seasonl2014/xueden-cloud-edu](https://github.com/seasonl2014/xueden-cloud-edu)**



## 功能

```
- 登录 / 注销 / 注册

- 权限验证
  - 页面权限
  - 按钮操作
  - 权限配置

- 全局功能
  - 国际化多语言
  - 动态顶级菜单（支持设置是否启用）
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑（支持自定义配置）
  - Svg Sprite 图标
  - Mock 数据

- 综合实例
  - 引导页
  - 组件示例
    - 编辑器
      - CKEditor
      - tui-editor
    - 图标
      - IconSvg
      - IconFont
  - 页面示例
    - 列表页面
      - 表格列表
      - 高度自适应表格
      - 搜索列表
    - 表单页面
      - 基础表单
      - 高级表单      
    - 详情页面
      - 基础详情
      - 模块详情
      - 表格详情
  - 权限验证
```

## 目录结构
```vue
├── mock                       # Mock文件目录
├── public                     # 静态资源
│   ├── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── assets                 # 静态资源
│   │   ├── css                # 项目公用 CSS 样式
│   │   ├── iconsvg            # svg icons
│   │   └── images             # 项目图片
│   ├── components             # 全局公用组件
│   ├── composables            # 全局 组合式 API
│   ├── config                 # 配置
│   │   │── i18n.ts            # 国际化配置入口
│   │   │── routes.ts          # 路由配置入口
│   │   │── settings.ts        # 站点配置
│   │   └── store.ts           # Vuex Store 配置入口
│   ├── directives             # 全局 自定义指令
│   ├── layout                 # 项目 layout
│   │   ├── IndexLayout        # 项目默认主 Layout
│   │   │   ├── components     # IndexLayout 公共组件
│   │   │   ├── composables    # IndexLayout 公共组合式 API
│   │   │   ├── locales        # IndexLayout 国际化，主要为路由菜单
│   │   │   ├── index.vue      # IndexLayout 模板入口
│   │   │   └── routes.ts      # 使用 IndexLayout 的页面路由配置
│   │   ├── UserLayout         # 项目 UserLayout
│   │   │   ├── locales        # UserLayout 国际化，主要为路由菜单
│   │   │   ├── index.vue      # UserLayout 模板入口
│   │   │   └── routes.ts      # 使用 UserLayout 的页面路由配置
│   │   ├── BlankLayout.vue    # 空 Layout
│   │   └── SecurityLayout.vue # 认证 Layout
│   ├── locales                # 全局国际化文件目录
│   │   ├── en-US.ts           # 全局公用英文国际化配置
│   │   ├── zh-CN.ts           # 全局公用中文简体国际化配置
│   │   ├── zh-TW.ts           # 全局公用中文繁体国际化配置
│   │   └── xxx.ts             # 全局公用其他语言国际化配置
│   ├── services               # 公共数据接口目录（AJAx 请求）
│   ├── store                  # 全局 Store 数据模型目录（Vuex）
│   │   ├── global.ts          # 全局 StoreModule
│   │   └── user.ts            # user 公共StoreModule
│   ├── utils                  # 全局工具函数目录
│   ├── views                  # 页面组件目录(所有页面放在这里)
│   │   └── home               # 页面-首页(这里作为说明样例)
│   │       ├── components     # 当前页面组件目录(可选)
│   │       ├── composables    # 当前页面组合式 API(可选)
│   │       ├── locales        # 当前页面国际化目录(可选)
│   │       ├── data.d.ts      # TS 类型定义文件(可选)
│   │       ├── index.vue      # 当前页面入口
│   │       ├── service.ts     # 当前页面数据接口文件(可选)
│   │       └── store.ts       # 当前页面数据模型文件(可选)
│   ├── App.vue                # App 入口
│   ├── main.ts                # 入口文件 加载组件 初始化等
│   └── shims-vue.d.ts         # Vue TypeScript 配置
├── tests                      # 测试目录
├── .browserslistrc            # 项目的浏览器配置
├── .env.development           # 开发环境变量配置
├── .env.production            # 生产环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .gitignore                 # Git忽略文件配置
├── babel.config.js            # babel-loader 配置
├── jest.config.js             # jest config
├── package.json               # 项目信息
├── README.md                  # readme
├── tsconfig.json              # TypeScript 配置
└── vue.config.js              # vue-cli 配置 
```

## 项目设置

### 一、Install dependencies,

```bash
$ yarn
```

or

```
$ npm install
```


### 二、Compiles and hot-reloads for development

```bash
$ yarn serve
```

or

```
$ npm run serve
```


### 三、Compiles and minifies for production

```bash
$ yarn build
```
or

```
$ npm run build
```

### 四、精简 svg icon

```
$ yarn svgo
```

or

```
$ npm run svgo
```

### 五、Run your unit tests
```
yarn test:unit

#

npm run test:unit
```

### 六、Lints and fixes files
```
yarn lint

#

npm run lint
```



# @epoint-fe/f9-tool

## Install

```sh
npm i @epoint-fe/f9-tool -g
```

## Use

```sh
# 查看帮助
epoint-f9-tool

# 初始化配置文件
epoint-f9-tool init

# 启动监控
# 默认含：
# sass 监控编译： sass -> postcss -> autoprefixer -> cssnano
# js 监控压缩 js -> uglify3
# BrowserSync 文件变化自动刷新浏览器
epoint-f9-tool start -c epoint.config.js

# 抽取主题 命令之后是交互式终端
epoint-f9-tool copytheme
```

## options

查看生成的 `epoint.config.js` 文件。

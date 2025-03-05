## Moleculer+

![Moleculer logo](apigate-service/public/assets/logo.png)

## 新增特性

-  标准的目录结构和代码仓库管理
-  定制版NCC，支持直接编译成单个js文件
-  目录文件`moduleRequire`，支持自动挂载和混入编译
-  重写`hotreload`热开发模式，支持`moduleRequire`修改后立即重启服务
-  日志打印及输出文件携带`traceid`，方便直接`requestid`过滤查询
-  内置`sequelize`,并支持分表模式
-  默认`Consul`作为配置中心以及服务注册中心
-  多策略认证模式，支持不同的认证方式
-  内置`ncc`和`make`指令，方便跨平台编译

## 快速入门

```zsh
$ npm install
$ npm link
$ npm start
$ npm build
```
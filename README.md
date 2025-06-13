## Moleculer+

基于 `moleculerjs` 微服务框架深度改造而来的项目，旨在提供更强大、更灵活、开箱即用的企业级解决方案。通过对原框架的全面优化与扩展，引入了全新的网关设计、统一的鉴权机制、高级服务组件，以及一系列贴近实际业务需求的企业级服务构建案例。本框架保留了 `moleculerjs` 的轻量与高效特性，同时在功能性、稳定性和易用性上进行了大幅提升，适用于构建现代化、高并发、分布式的企业应用。

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

运行consul（仅用于测试!）
```zsh
./consul.exe agent `
    -server `
    -bootstrap-expect=1 `
    -http-port=8400 `
    -data-dir=comm/assert/data `
    -bind="172.30.10.72" `
    -advertise="172.30.10.72" `
    -ui=true
```

## 可观测性建设（todo）
1. 日志系统（ELK / Loki）  
2. 监控系统（Prometheus / Grafana）  
3. 链路追踪（Jaeger / Zipkin / Skywalking）  
4. 告警机制（Webhook / 邮件 / 飞书）  

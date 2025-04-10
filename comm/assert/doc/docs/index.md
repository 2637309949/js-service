## moleculer+

## 新增特性

## 环境配置

先安装 `ncc`

```bash linenums="1"
cd ./comm/cmd/ncc && npm install -g .
cd ./comm/cmd/make && npm install -g .
```

最后安装配置服务 `consul`
```bash linenums="1"
hub="https://releases.hashicorp.com/consul"
releases="/1.20.2/consul_1.20.2_linux_amd64.zip"
wget "$hub$releases"
unzip consul_1.20.2_linux_amd64.zip
```

启动 `consul`, 该部署指令仅用于测试, 不要用在生产上
```bash linenums="1"
./consul agent \
-server \
-bootstrap-expect=1 \
-http-port=8400 \
-data-dir=comm/assert/data \
-bind="172.30.10.72" \
-advertise="172.30.10.72" \
-ui=true
```

window下执行
```bash linenums="1"
./consul.exe agent `
    -server `
    -bootstrap-expect=1 `
    -http-port=8400 `
    -data-dir=comm/assert/data `
    -bind="172.30.10.72" `
    -advertise="172.30.10.72" `
    -ui=true
```
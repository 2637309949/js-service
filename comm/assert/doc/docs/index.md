
启动 `consul`, 该部署指令仅用于测试, 不要用在生产上
```bash linenums="1"
./consul agent \
-server \
-bootstrap-expect=1 \
-http-port=8400 \
-data-dir=comm/assert/config/data \
-bind="172.30.10.72" \
-advertise="172.30.10.72" \
-ui=true
```

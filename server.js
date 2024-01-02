const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const cors = require('cors');
const {getLocalIP} = require("./getLocalIP");
const IP = getLocalIP()

// 创建代理服务器函数
function createProxyServer({path, target}) {
    const app = express();
    app.use(cors());

    app.use(path, createProxyMiddleware({
        target,
        changeOrigin: true,
        onProxyRes(proxyRes, req, res) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            /*let responseData = ''; // 保存返回的数据
            proxyRes.on('data', (chunk) => {
                responseData += chunk;
            });

            proxyRes.on('end', () => {
                console.log(`代理服务器${path}返回的数据：`, responseData);
            });*/
        },

        pathRewrite: {
            [`^${path}`]: '',
        },

    }));

    return app;
}


// 配置每个代理服务器
const proxyConfigurations = [
    {path: '/api', target: 'https://feiying.ahjinti.cn'},
    // {path: '/anotherApi', target: 'https://another-server.example.com'},
];

// 启动多个代理服务器
proxyConfigurations.forEach(({path, target}, index) => {
    const app = createProxyServer({path, target});
    const PORT = 3000 + index; // 3000, 3001, ...

    app.listen(PORT, () => {
        console.log(`代理服务器${index + 1}已启动 ${target} 应修改为：http://${IP}:${PORT}/api`);

    });
});

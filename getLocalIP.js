const os = require('os');

// 获取网络接口列表
const networkInterfaces = os.networkInterfaces();

function getLocalIP() {
    // 遍历接口列表，找到非回环地址的IPv4地址
    let ipAddress;
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (let i = 0; i < interfaces.length; i++) {
            const {family, internal, address} = interfaces[i];
            if (family === 'IPv4' && !internal) {
                ipAddress = address;
                break;
            }
        }
        if (ipAddress.indexOf('192.168.') !== -1) {
            break;
        }
    }

    // console.log('本机IP地址:', ipAddress);
    return ipAddress
}

module.exports = {
    getLocalIP
}

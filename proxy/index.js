const httpProxy = require('http-proxy');
const url = require('url');

const proxy = httpProxy.createProxy();
const options = {
    //add services here
    '/target': 'http://localhost:3001',
    '/sharpshooter': 'http://localhost:3002',
}

require('http').createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    for (const [pattern, target] of Object.entries(options)) {
        if (pathname === pattern || 
            pathname.startsWith(pattern + '/')
        ) {
            proxy.web(req, res, {target});
        }
    }
}).listen(3000);

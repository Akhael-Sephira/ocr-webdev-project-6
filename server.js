const http = require('http');
const config = require('./config');
const app = require('./app');

const port = normalizePort(config.app.port);
const server = http.createServer(app);

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'bind ' + address : 'port ' + address.port;
    console.log('Listening on:', bind);
    console.warn('No headers options')
});

server.listen(port);

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) return val;
    if (port => 0) return port;
    return false;
}


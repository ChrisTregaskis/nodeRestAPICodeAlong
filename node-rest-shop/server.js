const http = require('http');
const app = require('./app')
const port = process.env.PORT || 5050;
const server = http.createServer(app);

server.listen(port, () => console.log(`node-rest-shop App listening at http://localhost${port} brudda!`));
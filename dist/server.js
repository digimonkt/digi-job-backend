"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const http_1 = __importDefault(require("http"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
mongoose_1.default
    .connect(config_1.config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    console.log('Connected to the database');
})
    .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
});
const serverConfig = () => {
    console.log('Server configuration started');
    app.use((req, res, next) => {
        console.log(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Method: [${req.method}]`);
        res.on('finish', () => {
            console.log(`Outgoing -> Status: [${res.statusCode}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Method: [${req.method}]`);
        });
        next();
    });
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        }
        next();
    });
    app.use('/ping', (req, res) => {
        return res.status(200).json({ message: 'pong' });
    });
    for (const route of routes_1.ROUTER) {
        console.log(`Loading route ${route.path}`);
        app.use(`/api/v1${route.path}`, route.router);
    }
    app.use((req, res) => {
        console.log(req.body);
        const error = new Error('Not found');
        return res.status(404).json({ message: error.message });
    });
    http_1.default.createServer(app).listen(config_1.config.server.port, () => console.log(`Express is listening at http://localhost:${config_1.config.server.port}`));
};
serverConfig();
//# sourceMappingURL=server.js.map
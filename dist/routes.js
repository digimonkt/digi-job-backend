"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTER = void 0;
const index_1 = __importDefault(require("./user/routes/index"));
exports.ROUTER = [
    {
        path: '/user',
        router: index_1.default
    },
    {
        path: '/user/forget-password',
        router: index_1.default
    }
];
//# sourceMappingURL=routes.js.map
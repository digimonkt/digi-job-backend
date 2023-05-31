"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logging {
}
Logging.info = (args) => {
    console.log(chalk_1.default.blue(`[${new Date().toLocaleString()}][INFO] ${args}`), typeof args === 'string' ? chalk_1.default.blueBright(args) : args);
};
exports.default = Logging;
//# sourceMappingURL=logging.js.map
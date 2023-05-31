"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createtoken = (_id) => {
    // const userpower= md5(User_Type);
    const maxAge = 3 * 24 * 60 * 60;
    const Token = jsonwebtoken_1.default.sign({ _id }, process.env.TOKEN_HEADER_KEY, {
        expiresIn: maxAge
    });
    return Token;
};
exports.default = createtoken;
//# sourceMappingURL=create-token.js.map
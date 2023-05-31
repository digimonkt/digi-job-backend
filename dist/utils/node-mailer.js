"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMailFunc = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodeMailFunc = (email, link) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER_NAME,
            pass: process.env.PASSWORD //
        },
    });
    transporter.sendMail({
        from: process.env.USER_NAME,
        to: email,
        subject: "Reset Link",
        html: `<b>Rest Link ${link}</b>`, // html body
    }, (err, info) => {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log(info.response);
        }
    });
});
exports.nodeMailFunc = nodeMailFunc;
//# sourceMappingURL=node-mailer.js.map
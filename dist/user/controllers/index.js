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
exports.getUserDetail = exports.deleteSession = exports.changePassword = exports.forgotPassword = exports.createSession = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../../models/user-model"));
const userSession_model_1 = __importDefault(require("../../models/userSession-model"));
const node_mailer_1 = require("../../utils/node-mailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const create_token_1 = __importDefault(require("../../middleware/create-token"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role, mobile_number, country_code } = req.body;
        // apply for 
        const userDetails = {
            email,
            password,
            profile_role: role,
            mobile_number,
            country_code
        };
        const user = yield user_model_1.default.create(userDetails);
        const session = yield userSession_model_1.default.create({
            user: user._id,
            ip_address: req.socket.remoteAddress,
            agent: req.get('User-Agent'),
            active: true
        });
        const JWT_TOKEN = (0, create_token_1.default)(session._id);
        // const refreshToken = createToken()
        res.set({
            'x-access': JWT_TOKEN,
            'x-refresh': JWT_TOKEN
        });
        res.status(201).json({ body: { message: "User Created Successfully" } });
    }
    catch (error) {
        res.status(400).json({ body: { message: error.message } });
    }
});
exports.createUser = createUser;
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role, mobile } = req.body;
        console.log(req.body);
        // apply for 
        // const user = await UserModel.findOne({ $or: [ {email: key.email}, {mobile_number: key.mobile } ]});
        let user;
        if (email) {
            user = yield user_model_1.default.findOne({ email });
        }
        else if (mobile) {
            user = yield user_model_1.default.findOne({ mobile_number: mobile });
        }
        else {
            res.status(400).json({ body: { message: "Enter credentials" } });
            return;
        }
        console.log(user);
        console.log(user !== null, yield bcrypt_1.default.compare(password, user.password), user.profile_role === role);
        if (user !== null && (yield bcrypt_1.default.compare(password, user.password)) && user.profile_role === role) {
            // console.log(JWT_TOKEN)
            console.log(user);
            const session = yield userSession_model_1.default.create({
                user: user._id,
                ip_address: req.socket.remoteAddress,
                agent: req.get('User-Agent'),
                active: true
            });
            const JWT_TOKEN = (0, create_token_1.default)(session._id);
            res.set({
                'x-access': JWT_TOKEN,
                'x-refresh': JWT_TOKEN
            });
            res.status(201).json({ body: { message: "User LoggedIn Successfully" } });
        }
        else {
            res.status(400).json({ body: { message: "Invalid login credentials" } });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ body: { message: error.message } });
    }
});
exports.createSession = createSession;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        if (!(email)) {
            res.status(400).json({ body: { message: "Enter email" } });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ body: { message: "User not found" } });
            return;
        }
        const JWT_TOKEN = (0, create_token_1.default)(email);
        const link = 'http://localhost:1337' + '/change-password/' + JWT_TOKEN;
        (0, node_mailer_1.nodeMailFunc)(email, link);
        res.status(400).json({ body: { message: `Reset link sent to ${email}` } });
    }
    catch (error) {
        res.status(500).json({ body: { message: "Enter email" } });
    }
});
exports.forgotPassword = forgotPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        if (!(password)) {
            res.status(400).json({ body: { message: "Enter password" } });
        }
        const { token } = req.params;
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_HEADER_KEY);
        const user = yield user_model_1.default.findOne({ email: decodedToken });
        user.password = password;
        yield user.save();
        res.status(200).json({ body: { message: "Password changed successfully" } });
    }
    catch (error) {
        res.status(500).json({ body: { message: "Enter email" } });
    }
});
exports.changePassword = changePassword;
const deleteSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers['x-access-token'];
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_HEADER_KEY);
        console.log(decodedToken);
        const sessionId = decodedToken._id;
        // Find session document by ID
        const session = yield userSession_model_1.default.findById(sessionId);
        if (!session) {
            res.status(404).json({ body: { message: 'Session not found' } });
            return;
        }
        session.active = false;
        session.expire_at = new Date(Date.now());
        yield session.save();
        // Blacklist token
        // You can store the blacklisted token in a database or cache
        // and check it on subsequent requests to ensure that the token is not reused
        res.status(200).json({ body: { message: 'User logged out successfully' } });
    }
    catch (error) {
        res.status(500).json({ body: { message: "Logging Out unsuccessfull" } });
    }
});
exports.deleteSession = deleteSession;
const getUserDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
    }
    catch (error) {
    }
});
exports.getUserDetail = getUserDetail;
//# sourceMappingURL=index.js.map
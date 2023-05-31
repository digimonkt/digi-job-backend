"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controllers/index");
// import verifyToken from '../../middleware/verify-token'
const router = (0, express_1.Router)();
router.post('/', index_1.createUser);
router.post('/session', index_1.createSession);
router.get('/forget-password/:email', index_1.forgotPassword);
router.put('/change-password', index_1.changePassword);
router.delete('/delete-session', index_1.deleteSession);
router.get('/', index_1.getUserDetail);
exports.default = router;
//# sourceMappingURL=index.js.map
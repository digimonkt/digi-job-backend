"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
var gender;
(function (gender) {
    gender["male"] = "male";
    gender["female"] = "female";
})(gender || (gender = {}));
var employment_status;
(function (employment_status) {
    employment_status["employed"] = "employed";
    employment_status["unemployed"] = "unemployed";
})(employment_status || (employment_status = {}));
const JobSeekerSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true
    },
    gender: {
        type: String, required: false, unique: true
    },
    dob: {
        type: Date
    },
    employment_status: {
        type: String, required: false
    },
    description: {
        type: String, required: false
    },
    highest_education: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Education', required: false
    },
    market_information_notification: {
        type: Boolean, required: false
    },
    job_notification: {
        type: Boolean, required: false
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('JobSeeker', JobSeekerSchema);
//# sourceMappingURL=jobseeker-model.js.map
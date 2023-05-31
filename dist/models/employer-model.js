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
var organization_type;
(function (organization_type) {
    organization_type["Government"] = "Government";
    organization_type["NGO"] = "NGO";
    organization_type["Buisness"] = "Buisness";
})(organization_type || (organization_type = {}));
const employerSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true
    },
    description: {
        type: String, required: false
    },
    organization_type: {
        type: String, required: false
    },
    market_information_notification: {
        type: Boolean, required: false, default: false
    },
    other_notification: {
        type: Boolean, required: false, default: false
    },
    license_id: {
        type: String, required: false
    },
    license_id_file: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Media', required: false
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Employer', employerSchema);
//# sourceMappingURL=employer-model.js.map
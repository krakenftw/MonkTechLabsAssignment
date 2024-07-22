"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], required: true },
    timezone: { type: String, required: true },
    availibilty: [
        {
            timezone: String,
            date: String,
            startTime: String,
            endTime: String,
        },
    ],
    shifts: [
        {
            date: String,
            startTime: String,
            endTime: String,
            timezone: String,
        },
    ],
});
const User = mongoose_1.default.model("user", UserSchema);
exports.default = User;

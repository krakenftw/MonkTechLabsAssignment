"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
function dbConnect() {
    mongoose_1.default
        .connect(process.env.DATABASE_URL)
        .then(() => console.log("DB connected"))
        .catch((err) => console.log(err));
}
exports.default = dbConnect;

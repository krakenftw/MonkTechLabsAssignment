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
exports.handleUserLogout = exports.checkAuth = exports.handleUserLogin = exports.handleUserRegister = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const handleUserRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role, timezone } = req.body;
    if (!username || !password || !role || !timezone) {
        res.status(401).json({ msg: "All fields required" });
        return;
    }
    try {
        let user = yield User_1.default.findOne({ username });
        if (user) {
            res.status(400).json({ msg: "User already exists" });
            return;
        }
        user = new User_1.default({ username, password, role, timezone });
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password, salt);
        yield user.save();
        req.session.user = { id: user.id, role: user.role };
        res.json({ msg: "User registered successfully" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.handleUserRegister = handleUserRegister;
const handleUserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(402).json({ msg: "All fields required" });
        return;
    }
    try {
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            res.status(400).json({ msg: "Invalid Credentials" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ msg: "Invalid Credentials" });
            return;
        }
        req.session.user = { id: user.id, role: user.role };
        req.session.save();
        res.json({ msg: "User logged in successfully" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.handleUserLogin = handleUserLogin;
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.session);
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    }
    else {
        res.status(401).json({ msg: "Not authenticated" });
    }
});
exports.checkAuth = checkAuth;
const handleUserLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destroy session during logout", err);
            res.status(500).json({ msg: "Failed to log out" });
            return;
        }
        res.status(200).json({ msg: "User logged out successfully" });
    });
});
exports.handleUserLogout = handleUserLogout;

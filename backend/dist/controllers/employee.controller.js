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
exports.createavailibilty = exports.getShifts = exports.getavailibilty = void 0;
const User_1 = __importDefault(require("../models/User"));
function getavailibilty(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findById((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!user) {
                res.status(401).json({ msg: "user not found" });
                return;
            }
            res.json(user.availibilty);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });
}
exports.getavailibilty = getavailibilty;
function getShifts(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findById((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!user) {
                res.status(401).json({ msg: "user not found" });
                return;
            }
            res.json(user.shifts);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });
}
exports.getShifts = getShifts;
function createavailibilty(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { startTime, endTime, date, timezone } = req.body;
            if (!startTime || !endTime || !date || !timezone) {
                res.status(400).json({ msg: "All fields required" });
                return;
            }
            console.log(req.session);
            const user = yield User_1.default.findById((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!user) {
                res.status(401).json({ msg: "user not found" });
                return;
            }
            const startTimeDate = new Date(startTime);
            const endTimeDate = new Date(endTime);
            const durationInHours = endTimeDate.getTime() - startTimeDate.getTime();
            if (durationInHours < 4) {
                res.status(406).json({ msg: "Minimum 4 hour shift required" });
                return;
            }
            user.availibilty.push({
                date,
                startTime,
                endTime,
                timezone,
            });
            yield user.save();
            res.status(200).json({ availibilty: user.availibilty });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        }
    });
}
exports.createavailibilty = createavailibilty;

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
exports.adminCreateShift = exports.getAvailibiltyByEmployeeId = exports.getUsersWithTime = exports.getAllUsersWithAvailibilty = exports.adminGetAvailibilty = void 0;
const User_1 = __importDefault(require("../models/User"));
const adminGetAvailibilty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({ role: "employee" }).select("username availibilty timezone");
        res.json({ data: users });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
exports.adminGetAvailibilty = adminGetAvailibilty;
const getAllUsersWithAvailibilty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}, { password: 0 }).exec();
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.getAllUsersWithAvailibilty = getAllUsersWithAvailibilty;
const getUsersWithTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, startTime, endTime } = req.body;
    if (!date || !startTime || !endTime) {
        return res.status(400).json({ msg: "All fields required" });
    }
    try {
        const allData = yield User_1.default.find({ role: "employee" });
        const shiftStart = new Date(`${date}T${startTime}:00.000Z`).getTime();
        const shiftEnd = new Date(`${date}T${endTime}:00.000Z`).getTime();
        const filteredData = allData.filter((each) => {
            return each.availibilty.some((availibilty) => {
                const availableStart = new Date(availibilty.startTime).getTime();
                const availableEnd = new Date(availibilty.endTime).getTime();
                console.log(shiftStart >= availableStart && shiftEnd <= availableEnd);
                return shiftStart >= availableStart && shiftEnd <= availableEnd;
            });
        });
        return res.json({ data: filteredData });
    }
    catch (error) {
        console.error("Error fetching users with time:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.getUsersWithTime = getUsersWithTime;
const getAvailibiltyByEmployeeId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId } = req.params;
    const { timezone } = req.query;
    try {
        const user = yield User_1.default.findById(employeeId).exec();
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        let availibilty = user.availibilty;
        res.json(availibilty);
    }
    catch (err) {
        console.error("Failed to fetch availibilty", err);
        res.status(500).json({ msg: "Server error" });
    }
});
exports.getAvailibiltyByEmployeeId = getAvailibiltyByEmployeeId;
const adminCreateShift = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, date, startTime, endTime, timezone } = req.body;
    if (!userId || !date || !startTime || !endTime || !timezone) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        console.log(user);
        const newShiftStart = new Date(`${date}T${startTime}:00.000Z`).getTime();
        const newShiftEnd = new Date(`${date}T${endTime}:00.000Z`).getTime();
        const isClashing = user.shifts.some((shift) => {
            const existingShiftStart = new Date(`${shift.date}T${shift.startTime}:00.000Z`).getTime();
            const existingShiftEnd = new Date(`${shift.date}T${shift.endTime}:00.000Z`).getTime();
            return ((newShiftStart >= existingShiftStart && newShiftStart < existingShiftEnd) ||
                (newShiftEnd > existingShiftStart && newShiftEnd <= existingShiftEnd) ||
                (newShiftStart <= existingShiftStart && newShiftEnd >= existingShiftEnd));
        });
        if (isClashing) {
            return res.status(400).json({ msg: "Shift times overlap with existing shifts" });
        }
        const shift = {
            date,
            startTime,
            endTime,
            timezone,
        };
        user.shifts.push(shift);
        yield user.save();
        res.status(200).json({ msg: "Shift created successfully", shifts: user.shifts });
    }
    catch (err) {
        console.error("Error creating shift:", err);
        res.status(500).json({ msg: "Server error" });
    }
});
exports.adminCreateShift = adminCreateShift;

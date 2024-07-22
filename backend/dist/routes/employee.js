"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const isLoggedIn_1 = require("../middlewares/isLoggedIn");
const employeeRouter = (0, express_1.Router)();
employeeRouter.post("/availibilty", isLoggedIn_1.isLoggedIn, employee_controller_1.createavailibilty);
employeeRouter.get("/availibilty", isLoggedIn_1.isLoggedIn, employee_controller_1.getavailibilty);
employeeRouter.get("/shifts", isLoggedIn_1.isLoggedIn, employee_controller_1.getShifts);
exports.default = employeeRouter;
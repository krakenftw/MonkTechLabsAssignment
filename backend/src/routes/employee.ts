import { Router } from "express";
import {
  createavailibilty,
  getavailibilty,
  getShifts,
} from "../controllers/employee.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn";

const employeeRouter = Router();

employeeRouter.post("/availibilty", isLoggedIn, createavailibilty);

employeeRouter.get("/availibilty", isLoggedIn, getavailibilty);
employeeRouter.get("/shifts", isLoggedIn, getShifts);

export default employeeRouter;

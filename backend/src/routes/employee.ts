import { Router } from "express";
import {
  createavailibilty,
  getavailibilty,
  getShifts,
} from "../controllers/employee.controller";

const employeeRouter = Router();

employeeRouter.post("/availibilty", createavailibilty);

employeeRouter.get("/availibilty", getavailibilty);
employeeRouter.get("/shifts", getShifts);

export default employeeRouter;

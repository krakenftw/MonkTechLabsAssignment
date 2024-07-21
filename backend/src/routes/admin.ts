import { Router } from "express";
import {
  adminCreateShift,
  adminGetAvailibilty,
  getAllUsersWithAvailibilty,
  getAvailibiltyByEmployeeId,
  getUsersWithTime,
} from "../controllers/admin.controller";
import { isAdmin } from "../middlewares/adminMiddleware";

const adminRouter = Router();

adminRouter.get("/availibilty", isAdmin, adminGetAvailibilty);
adminRouter.post("/shifts", isAdmin, adminCreateShift);
adminRouter.get("/users", isAdmin, getAllUsersWithAvailibilty);
adminRouter.get(
  "/availibilty/:employeeId",
  isAdmin,
  getAvailibiltyByEmployeeId,
);
adminRouter.post("/availibilty/time", isAdmin, getUsersWithTime);
adminRouter.post("/shifts/create", isAdmin, adminCreateShift);

export default adminRouter;

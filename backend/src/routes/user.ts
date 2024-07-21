import express from "express";
import {
  checkAuth,
  handleUserLogin,
  handleUserLogout,
  handleUserRegister,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/login", handleUserLogin);
userRouter.post("/register", handleUserRegister);
userRouter.get("/check-auth", checkAuth);
userRouter.post("/logout", handleUserLogout);

export default userRouter;

import express, { Express, Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import dbConnect from "./db";
import session from "express-session";
import cors from "cors";
import userRouter from "./routes/user";
import employeeRouter from "./routes/employee";
import adminRouter from "./routes/admin";
dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);
dbConnect();
const port = process.env.PORT || 3000;

app.use("/user", userRouter);
app.use("/employee", employeeRouter);
app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      role: "admin" | "employee";
    };
  }
}

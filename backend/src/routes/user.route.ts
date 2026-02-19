import { Router } from "express";
import { createUser } from "../controllers/user.controller";



const userRouter = Router();

// Create a new user
userRouter.post("/users", createUser);

export default userRouter;
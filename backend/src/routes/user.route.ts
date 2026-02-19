import { Router } from "express";
import { createUser } from "../controllers/user.controller";



const router = Router();

// Create a new user
router.post("/users", createUser);

export default router;
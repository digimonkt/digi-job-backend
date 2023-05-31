import { Router } from "express";
import { createUserHandler } from "./user.controllers";

const router = Router();

router.post('/', validator(), createUserHandler)
import { Router } from "express";
import { add, login, logout, checkauth } from "./controller.js";


const router = Router();

router.get('/checkauth', checkauth)
router.post('/singup', add);
router.post('/login', login)
router.get('/logout', logout);


export default router;
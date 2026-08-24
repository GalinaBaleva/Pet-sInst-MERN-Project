import { Router } from "express";
import { add, login, logout, checkauth, getUser, changeProfilePassword, changeProfileImage } from "./controller.js";
import upload from '../middlewere/multer.js';
import { authLimiter } from '../server.js';

const router = Router();

router.get('/checkauth', checkauth);
router.post('/singup', authLimiter, add);
router.post('/login', authLimiter, login);
router.get('/logout', logout);

router.get('/profile', getUser);
router.post('/profile/edit-password', changeProfilePassword);
router.post('/profile/edit-image', upload.single('image'), changeProfileImage);

export default router;

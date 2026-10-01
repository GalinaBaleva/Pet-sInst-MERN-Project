import { Router } from "express";
import { add, login, logout, checkauth, getUser, changeProfilePassword, changeProfileImage } from "./controller.js";
import upload from '../middleware/multer.js';
import { authLimiter } from '../utils/limiters.js';
import { requireAuth } from '../utils/checkauth.js';

const router = Router();

router.get('/checkauth', checkauth);
router.post('/signup', authLimiter, add);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

router.get('/profile', getUser);
router.post('/profile/edit-password', requireAuth, changeProfilePassword);
router.post('/profile/edit-image', requireAuth, upload.single('image'), changeProfileImage);

export default router;

import express from 'express';
import upload from '../middleware/multer.js';
import { addLike, createNewPost, getAllPosts, getTopPosts, getToEditPost, editPost, deletePost, getProfile, postComment, getAllComments } from './controllers.js';
import { commentLimiter } from '../utils/limiters.js';
import { requireAuth } from '../utils/checkauth.js';

const router = express.Router();

router.get('/catalog', getAllPosts);
router.get('/top', getTopPosts);

router.get('/profile/:id', requireAuth, getProfile);

router.post('/create', requireAuth, upload.single('image'), createNewPost);

router.post('/like/', requireAuth, addLike);

router.post('/comment', requireAuth, commentLimiter, postComment);
router.get('/comment/:id', getAllComments);

router.get('/edit/:id', requireAuth, getToEditPost);
router.post('/edit/:id', requireAuth, upload.single('image'), editPost);
router.post('/delete', requireAuth, deletePost);

export default router;

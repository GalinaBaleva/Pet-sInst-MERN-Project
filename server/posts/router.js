import express from 'express';
import upload from '../middlewere/multer.js';
import { addLike, createNewPost, getAllPosts, getTopPosts, getToEditPost, editPost, deletePost, getProfile, postComment, getAllComments } from './controllers.js';
import { commentLimiter } from '../server.js';

const router = express.Router();

const checkauth = (req, res, next) => {
    if (req.session.userid) {
        next();
    } else {
        res.status(401).send({ message: 'You are not logged in!' });
    }
};

router.get('/catalog', getAllPosts);
router.get('/top', getTopPosts);

router.get('/profile/:id', checkauth, getProfile);

router.post('/create', checkauth, upload.single('image'), createNewPost);

router.post('/like/', checkauth, addLike);

router.post('/comment', checkauth, commentLimiter, postComment);
router.get('/comment/:id', getAllComments);

router.get('/edit/:id', checkauth, getToEditPost);
router.post('/edit/:id', checkauth, upload.single('image'), editPost);
router.post('/delete', checkauth, deletePost);

export default router;

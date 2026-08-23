import express from 'express';
const router = express.Router();

import upload from '../middlewere/multer.js';
import { addLike, createNewPost, getAllPosts, getTopPosts, getToEditPost, editPost, deletePost, getProfile, postComment, getAllComments } from './controllers.js';

const checkauth = async (req, res, next) => {
    if (req.session.userid) {
        next();
    } else {
        res.status(401).send({ message: 'You are not logged in!' })
    }
}


router.get('/catalog', getAllPosts);
router.get('/top', getTopPosts)

router.get('/profile/:id', checkauth, getProfile);

router.post('/create', upload.single('image'), checkauth, createNewPost);

router.post('/like/', checkauth, addLike);

router.post('/comment', checkauth, postComment);
router.get('/comment/:id', getAllComments);

router.get('/edit/:id', checkauth, getToEditPost);
router.post('/edit/:id', upload.single('image'), checkauth, editPost);
router.post('/delete', checkauth, deletePost);

export default router;
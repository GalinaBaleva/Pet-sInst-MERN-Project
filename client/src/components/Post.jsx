import { Link, useNavigate } from 'react-router-dom';
import dateFormat from 'dateformat';
import './Post.css'
import { get, post } from '../shared/utils/api';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Comment from './Comment';


const Post = (props) => {
    const navigation = useNavigate();
    const [text, setText] = useState('');
    const [comments, setComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [liking, setLiking] = useState(false);
    const {
        description,
        image,
        likes,
        name,
        userid,
        username,
        userimage,
        date,
        likedBy,
        liked,
        _id,
        likesClickHandler,
        afterDeleteHandler
    } = props;


    const fetchComments = async () => {
        const response = await get(`/posts/comment/${_id}`);

        if (response.error || response.status !== 200) {
            return console.log(response.error);
        }

        setComments(response.data.comments);
    }

    useEffect(() => {
        fetchComments();
    }, []);

    const login = useSelector(state => state.login);
    const usernameLocal = useSelector(state => state.username);
    const userIdLocal = useSelector(state => state.userid);


    const deleteHandler = async () => {
        const response = await post('/posts/delete/', { _id: _id });

        if (response.status === 200) {
            afterDeleteHandler();
        } else {
            console.log(response);
        }
    }

    const editHandler = () => {
        navigation('/edit', { state: { _id } });
    }

    const textAreaChengeHandler = (e) => {
        setText(e.target.value);
    }

    const postCommentHandler = async () => {
        const response = await post(`/posts/comment/`, {
            postId: _id,
            commentUser: usernameLocal,
            commentUserId: userIdLocal,
            comment: text
        });

        if (response.error || response.status !== 200) {
            console.log(response.error);
            return;
        }
        fetchComments();
        setText('');
    }

    const handleLikeClick = async () => {
        if (liking) return;
        setLiking(true);
        await likesClickHandler(_id);
        setLiking(false);
    };

    const toggleComments = () => {
        setShowAllComments(prev => !prev);
    }

    const commentsToDisplay = showAllComments ? comments : comments.slice(0, 1);

    const onOwnerClickHandler = (e) => {
        navigation('/profile', { state: { userid } });
    }

    return (
        <>
            <div className="post" data={_id}>
                <div className="post-owner-info" data={userid}>
                    <div className="post-owner-info-separator" onClick={onOwnerClickHandler}>
                        <div className="post-owner-img"><img src={userimage} alt="pet" /></div>
                        <div className="post-owner-name">{username}</div>
                    </div>
                    <div className="post-owner-info-separator">
                        {usernameLocal === username
                            ? <>
                                <i
                                    className="fa-solid fa-pencil"
                                    onClick={editHandler}
                                ></i>
                                <i
                                    className="fa-solid fa-trash"
                                    onClick={deleteHandler}
                                ></i>
                            </>
                            : ''}
                    </div>
                </div>
                <div className="post-img"><img src={image} alt="pet" /></div>
                <div className="post-info">
                    <div
                        className="post-likes"
                    >
                        {login
                            && <i
                                className={!liked ? "fa-regular fa-heart" : "fa-solid fa-heart"}
                                onClick={handleLikeClick}
                                style={{ opacity: liking ? 0.5 : 1, cursor: liking ? 'default' : 'pointer' }}
                            ></i>
                        }
                    </div>
                    <div className="post-likes-count">{likes}</div>
                    <div className="post-description">{description}</div>
                </div>
                <div className="post-date">{dateFormat(date, "dd.mm.yyyy,  h:MM:ss TT")}</div>
                <div className="post-all-comments">
                    {comments.length > 0 ? (
                        <>
                            {commentsToDisplay.map(c =>
                                <Comment
                                    key={c._id}
                                    commentuserid={c.commentuserid}
                                    commentusersname={c.commentusersname}
                                    comment={c.comment}
                                    commentDate={c.commentDate} />
                            )}
                            {!showAllComments && comments.length > 1 &&
                                <span className="post-show" onClick={toggleComments}>
                                    ...more
                                </span>
                            }
                            {showAllComments &&
                                <span className="post-show" onClick={toggleComments}>
                                    less
                                </span>}
                        </>
                    )
                        : ''
                    }
                </div>
                {login &&
                    <div className="post-add-comment">
                        <textarea value={text} onChange={textAreaChengeHandler} name='add-comment' className="post-add-comment" placeholder='Add a comment...'></textarea>
                        <button onClick={postCommentHandler}>POST</button>
                    </div>
                }
            </div >
        </>
    )
}

export default Post;
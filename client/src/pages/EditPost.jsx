import { useLocation } from "react-router-dom";
import PostForm from "../components/PostForm";
import { useEffect, useState } from "react";
import { get } from "../shared/utils/api";

const EditPost = () => {
    const location = useLocation();
    const [post, setPost] = useState('');

    useEffect(() => {
        get('/posts/edit/' + location.state._id)
            .then(r => {
                console.log(r)
                setPost(r.data)
            });
    }, [])
    return (
        <div className="createPage">
            <PostForm
                button='Edit Now'
                legend='Edit Photo'
                action='edit'
                name={post.name}
                description={post.description}
                path={'/posts/edit/' + post._id}
            />
        </div>
    )
};

export default EditPost;
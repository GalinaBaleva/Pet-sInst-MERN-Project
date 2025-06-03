import './Profile.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserInfo from "../components/UserInfo";
import { useEffect, useState } from 'react';
import { get, post } from '../shared/utils/api.js'
import { useSelector } from 'react-redux';
import Post from '../components/Post.jsx';
import { useLocation } from 'react-router-dom';


const Profile = () => {
    const [user, setUser] = useState('');
    const [posts, setPosts] = useState([]);
    const [isOwner, setIsOwner] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPostsCount, setTotalPostsCount] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const lacation = useLocation('');

    let currrentId;

    if (!lacation.state) {
        currrentId = useSelector(state => state.userid)
    } else {
        currrentId = lacation.state.userid;
    }


    useEffect(() => {
        fetchData(currentPage);
    }, []);

    const fetchData = async (pageToLoad) => {
        try {

            const userResponse = await get(`/user/profile?userid=${currrentId}`);
            if (userResponse.data) {
                setUser(userResponse.data);
                const postsResponse = await get(`/posts/profile/${userResponse.data._id}?page=${pageToLoad}`);
                if (postsResponse.status === 200) {
                    const newPosts = postsResponse.data.usersPosts;

                    setTotalPostsCount(postsResponse.data.totalPosts);

                    setPosts(prevPosts => {
                        const allPosts = [...prevPosts, ...newPosts];

                        const uniquePost = Array.from(new Map(allPosts.map(post => [post._id, post])).values());
                        return uniquePost;
                    });
                    setIsOwner(postsResponse.data.owner);
                    setHasMore(pageToLoad < postsResponse.data.totalPages);
                    setCurrentPage(pageToLoad + 1);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const likesClickHandler = async (_id) => {
        try {
            const response = await post('/posts/like/', { _id });
            const { liked, likes } = response.data;

            setPosts(prevPosts =>
                prevPosts.map(
                    post => post._id === _id
                        ? { ...post, likes, liked }
                        : post
                )
            );
        } catch (err) {
            console.log("Error liking, err");
        }
    }

    const afterDeleteHandler = async () => {
        get(`/posts/profile/${user._id}`).then(response => {
            setPosts(response.data.usersPosts);
            setTotalPostsCount(response.data.totalPosts);
        }); 
    }

    return (
        <>
            <UserInfo
                _id={user._id}
                username={user.username}
                userimage={user.userimage}
                isOwner={isOwner}
                postCount={totalPostsCount}
            />

            <InfiniteScroll
                className="user-posts"
                dataLength={posts.length}
                next={fetchData.bind(null, currentPage)}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center', flex: '1 1 100%' }}>
                        {posts.length > 0 ? <b>Yay! You have seen it all</b> : <b>No Posts Yet</b>}
                    </p>
                }
            >

                {totalPostsCount > 0
                    && posts.map(
                        p =>
                            <Post
                                key={p._id}
                                description={p.description}
                                image={p.image}
                                likes={p.likes}
                                name={p.name}
                                userid={p.userid}
                                username={user.username}
                                userimage={user.userimage}
                                date={p.date}
                                likedBy={p.likedBy}
                                liked={p.liked}
                                _id={p._id}
                                likesClickHandler={likesClickHandler}
                                afterDeleteHandler={afterDeleteHandler}
                            />)
                }

            </InfiniteScroll >
        </>
    )
}

export default Profile;
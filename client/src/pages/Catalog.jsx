import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from "../components/Post";
import { get, post } from '../shared/utils/api.js';


const Catalog = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setcurrentPage] = useState(1);
    const [totalPostsCount, setTotalPostsCount] = useState('');
    const [hasMore, setHasMore] = useState(true);


    const likesClickHandler = async (_id) => {
        try {
            const response = await post('/posts/like/', { _id });
            const { liked, likes } = response.data;
            console.log(response)

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

    useEffect(() => {
        fetchData(currentPage);

    }, []);

    const fetchData = async (pageToLoad) => {
        try {
            const response = await get(`/posts/catalog?page=${pageToLoad}`);
            const newPosts = response.data.posts;
            const totalPages = response.data.totalPages;

            setPosts(prevPosts => {
                const allPosts = [...prevPosts, ...newPosts];

                const uniquePost = Array.from(new Map(allPosts.map(post => [post._id, post])).values());
                return uniquePost;
            });

            setTotalPostsCount(response.data.totalPostsCount);

            setHasMore(pageToLoad < totalPages);
            setcurrentPage(pageToLoad + 1);

        } catch (err) {
            console.log(err)
        }
    }

    const afterDeleteHandler = async () => {
        get('/posts/catalog').then(response => setPosts(response.data.posts));
    }

    return (
        <InfiniteScroll
            className="posts-wrapper"
            dataLength={posts.length}
            next={fetchData.bind(null, currentPage)}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: 'center', flex: '1 1 100%' }}>
                    <b>Yay! You have seen it all</b>
                </p>
            }
        >
            {totalPostsCount > 0 && posts.map(p =>
                <Post
                    key={p._id}
                    description={p.description}
                    image={p.image}
                    likes={p.likes}
                    name={p.name}
                    userid={p.userid}
                    username={p.username}
                    userimage={p.userimage}
                    date={p.date}
                    likedBy={p.likedBy}
                    liked={p.liked}
                    _id={p._id}
                    likesClickHandler={likesClickHandler}
                    afterDeleteHandler={afterDeleteHandler}
                />
            )}
        </InfiniteScroll>
    )
}

export default Catalog;

import { useState, useEffect } from 'react';
import './Top.css';
import { get } from '../shared/utils/api.js'
import { Link } from 'react-router-dom';
import TopCard from './TopCard.jsx';

const Top = () => {
    const [posts, setPosts] = useState('');

    useEffect(() => {
        get('/posts/top')
            .then(r => {
                if (r.status !== 200) {
                    return console.log(r.message);
                }

                setPosts(r.data);
            })
    }, []);
    
    return (
        <section className="top sections-wrapper">
            <h2>Top 3 the most liked posts</h2>
            {posts.length <= 0
                ? <p>No posts yet!</p>
                :
                <div className="top-wrapper">
                    {posts.map(p => 
                    <TopCard 
                    key={p._id}
                    image={p.image}
                    name={p.name}
                    description={p.description}
                    likes={p.likes}
                    />)}
                </div>
            }
            <Link to='/catalog' className="all">
                <div className="all">All Posts</div>
            </Link>
        </section >
    )
}

export default Top;
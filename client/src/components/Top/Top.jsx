import './Top.css';

const Top = () => {
    return (
        <section className="top sections-wrapper">
            <h2>Top 3 the most liked posts this weeck</h2>
            <div className="top-wrapper">
                <div className="card">
                    <div className="card-img"><img src="/src/components/Top/pexels-chevanon-1108099.jpg" alt="pet" /></div>
                    <div className="info-after-hove">
                        <div className="card-owner-info">Some Info</div>
                        <div className="card-likes"><i className="fa-regular fa-heart"></i></div>
                        <div className="card-description">I like my pet a lot</div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-img"><img src="/src/components/Top/pexels-ekamelev-927500.jpg" alt="pet" /></div>
                    <div className="info-after-hove">
                        <div className="card-owner-info">Some Info</div>
                        <div className="card-likes"><i className="fa-regular fa-heart"></i></div>
                        <div className="card-description">I like my pet a lot</div>
                    </div>
                </div><div className="card">
                    <div className="card-img"><img src="/src/components/Top/pexels-lina-1741205.jpg" alt="pet" /></div>
                    <div className="info-after-hove">
                        <div className="card-owner-info">Some Info</div>
                        <div className="card-likes"><i className="fa-regular fa-heart"></i></div>
                        <div className="card-description">I like my pet a lot</div>
                    </div>
                </div>
            </div>

            <button className="all">All Posts</button>
        </section>
    )
}

export default Top;
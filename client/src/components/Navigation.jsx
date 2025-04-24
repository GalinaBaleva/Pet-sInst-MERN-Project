import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = (props) => {
    const navigate = useNavigate();
    return (
        <>
            <header className="site-header">
                    <Link to='/' className="header-first">
                        <div><i className="fa-solid fa-paw"></i></div>
                        <div className="logo">Pets.Inst</div>
                    </Link>
                <div className="header-second">
                    <div className="navbar-closed">
                        <i className="fa-solid fa-bars" />
                    </div>
                    <nav id="navbar" className="inactive">
                        <ul role="list" className="nav-list-items">
                            <li><NavLink id="catalog" to='/catalog'>Catalog</NavLink></li>
                            {!props.isLogged
                                ?
                                <>
                                    <li><NavLink id="login" to='/login'>Login</NavLink></li>
                                    <li><NavLink id="register" to='/singup'>Register</NavLink></li>
                                </>
                                :
                                <>
                                    <li><NavLink id="my-posts" to='/my-posts'>My Posts</NavLink></li>
                                    <li><NavLink id="new-post" to='/new-post'>New Post</NavLink></li>
                                    <li><NavLink id="logout" to='/logout'>Logout</NavLink></li>
                                </>
                            }


                        </ul>
                    </nav>
                </div>
            </header >
        </>
    )
}

export default Navigation;
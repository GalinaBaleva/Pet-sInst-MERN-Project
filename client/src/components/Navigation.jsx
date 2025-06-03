import { Link, NavLink } from 'react-router-dom';
import './Navigation.css';
import { useDispatch, useSelector } from 'react-redux';
import { get } from "../shared/utils/api";
import { useEffect, useState } from 'react';

const Navigation = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.username);
    const [closedNavIcon, setClosedNavIcon] = useState(true)

    const clickHandler = async () => {
        setClosedNavIcon((toggle) => toggle = !toggle);
        const response = await get('/user/logout');

        if (response.status === 200) {
            dispatch({ type: 'logout' });
        }
    }

    const clickTogglelNav = () => {
        setClosedNavIcon((toggle) => toggle = !toggle);
    }

    const closeNavHandler = () => {
        setClosedNavIcon((toggle) => toggle = !toggle);
    }

    useEffect(() => {
        document.addEventListener('scroll', () => {
            setClosedNavIcon(true);
        })
    }, [])

    return (
        <>
            <header className="site-header">
                <Link to='/' className="header-first">
                    <div><i className="fa-solid fa-paw"></i></div>
                    <div className="logo">Pets.Inst</div>
                </Link>
                <div className="header-second">
                    <div className="navbar-closed">
                        <i className="fa-solid fa-bars" onClick={clickTogglelNav} />                                        
                        {user && <div className="users-greeting mobile">Hallo {user}</div>}
                    </div>
                    <nav id="navbar" className={closedNavIcon ? 'inactive-toggle-nav' : 'active-toggle-nav'}>
                        <ul role="list" className="nav-list-items">
                            <li>
                                <NavLink
                                    id="catalog"
                                    to='/catalog'
                                    onClick={closeNavHandler}
                                >Catalog</NavLink></li>
                            {!props.isLogged
                                ?
                                <>
                                    <li>
                                        <NavLink to='/login'
                                            onClick={closeNavHandler}
                                        >Login
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/singup'
                                            onClick={closeNavHandler}
                                        >Register
                                        </NavLink>
                                    </li>
                                </>
                                :
                                <>
                                    <li>
                                        <NavLink to='/new-post'
                                            onClick={closeNavHandler}
                                        >New Post
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/profile'
                                            onClick={closeNavHandler}
                                        >My Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to='/logout'
                                            onClick={clickHandler}
                                        >Logout
                                        </NavLink>
                                        <div className="users-greeting no-mobile">Hallo {user}</div>
                                    </li>
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
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import SingUp from './pages/SingUp';
import SingIn from './pages/SingIn';
import Catalog from './pages/Catalog';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import { useState } from 'react';

function App() {
  const [authCheckecked, setAuthCheckecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(import.meta.env.VITE_API_URL + '/user/checkauth', {
          credentials: 'include'
        });
        if (response.status === 200) {
          let data = await response.json();

          dispatch({ type: 'login', username: data.username, userid: data.userid });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setAuthCheckecked(true);
      }
    }
    fetchData();
  }, []);

  const login = useSelector(state => state.login);
  if (!authCheckecked) return <div>Loading...</div>;

  return (
    <>
      <BrowserRouter>
        <Navigation isLogged={login} />
        <main>
          <Routes>
            <Route path='/catalog' element={<Catalog />} />
            {!login
              ?
              <>
                <Route path='/singup' element={<SingUp />} />
                <Route path='/login' element={<SingIn />} />
              </>
              :
              <>
                <Route path='/new-post' element={<NewPost />} />
                <Route path='/edit' element={<EditPost />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/edit-profile' element={<EditProfile />} />
              </>
            }
            <Route path='/' element={<Home />} />
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import SingUp from './pages/SingUp';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(import.meta.env.VITE_API_URL + '/user/checkauth', {
          credentials: 'include'
        });
        if (response.status === 200) {
          let data = await response.json();
          console.log(data);
          dispatch({ type: 'login', username: data.username });
        } else {
          console.log('nicht eingeloggt');
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const login = useSelector(state => state.login);

  return (
    <>
      <BrowserRouter>
        <Navigation isLogged={login} />
        <main>
          <Routes>
            {!login
              ? <>
                <Route path='/singup' element={<SingUp />} />
              </>
              :
              <>
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
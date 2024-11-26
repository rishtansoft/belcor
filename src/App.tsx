import { FC, ReactElement, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

const App: FC = ({}) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const navigate = useNavigate();

  useEffect(() => {
    console.log(12);
    
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
    } else {
      navigate('/login')
    }
  }, [navigate])

  interface PrivateProps {
    isAuth: boolean;
    children: ReactElement;
  }

  function PrivateRoute(props: PrivateProps) {
    const { isAuth, children } = props;

    const navigate = useNavigate();

    if (!isAuth) {
      navigate('/login');
    }

    return children;
  }

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <PrivateRoute isAuth={!!token}>
              <Home></Home>
            </PrivateRoute>
          }
        ></Route>
        <Route path='/login' element={<Login></Login>}></Route>
      </Routes>
    </div>
  );
};

export default App;

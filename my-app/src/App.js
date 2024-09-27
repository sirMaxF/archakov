import logo from './logo.svg';
import './App.css';
import Auth from './pages/Auth.js';
import { Reg, Edit, Create } from './pages/exportpages.js';
import { PostList } from './pages/PostList.js';
import { SinglePost } from './pages/SinglePost.js';
import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthThunk } from './redux/slices/auth.js';


// проверка авторизован ли ползователь

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthThunk());
  }, [])


  return (
    <Routes>
      <Route path='/' element={<PostList></PostList>}></Route>
      <Route path='/page/:id/' element={<SinglePost></SinglePost>}></Route>
      <Route path='/auth/' element={<Auth></Auth>}></Route>
      <Route path='/reg/' element={<Reg></Reg>}></Route>
      <Route path='/create/' element={<Create></Create>}></Route>
      <Route path='/editpage/:id/' element={<Edit></Edit>}></Route>
    </Routes>
  );
}

export default App;

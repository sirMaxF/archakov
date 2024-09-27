import { authThunk, selectAuth } from '../redux/slices/auth.js';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Auth = () => {
    const dispatch = useDispatch();
    const myRef = useRef(null);
    const navigate = useNavigate();

    function handleClick(e) {
        e.preventDefault();
        let data = new FormData(myRef.current);
        data = Object.fromEntries(data);
        dispatch(authThunk(data));
    };

    const isAuth = useSelector(selectAuth)

    // если пользователь зарегистрирован, направляем его на главную
    isAuth && navigate('/');

    console.log('isAuth' + isAuth)

    return (
        <form className="cont" name='formlogin' ref={myRef} onSubmit={handleClick}>
            <p>Вход</p>
            <p><label htmlFor='email'>Введите почту:</label></p>
            <p><input id='email' type="email" name='email'></input></p>
            <p>Введите пароль</p>
            <p><input type="password" name='password'></input></p>
            <p><input type="submit" value='Пуск'></input></p>
        </form>
    )
}

export default Auth;
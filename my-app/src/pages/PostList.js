import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchPostsThunk, fetchPostDelThunk } from '../redux/slices/posts.js'
import { Link } from 'react-router-dom'
import { logout } from '../redux/slices/auth.js';

export const PostList = () => {
    const dispatch = useDispatch();
    const id = useSelector(state => state.auth._id);
    // в коде ниже state.posts.posts: 
    // первое post это атрибут name у postSlice, 
    // второе post это параметр состояния (см initialState для postSlice )
    const postsLists = useSelector(state => state.posts.posts.items);
    const postsStatus = useSelector(state => state.posts.posts.status);

    console.log(postsLists)

    // загрузка списка постов
    useEffect(() => {
        if (postsStatus === 'loading') {
            dispatch(fetchPostsThunk());
        }
    }, [postsStatus, dispatch])

    // кнопка выхода
    function handleButtonClick() {
        if (window.confirm('Действительно хотите выйти?')) {
            dispatch(logout());
            window.localStorage.removeItem('token')
        }
    }

    return (
        <>
            <h3><button onClick={handleButtonClick}>Выйти</button></h3>
            {
                (postsStatus === 'fulfilled') ?
                    postsLists.map(value =>
                        <li key={crypto.randomUUID()}>
                            <Link to={`/page/${value._id}`}> {value.title} {(value.user?._id === id) && 'Del'}</Link>
                            <Link to={`/editpage/${value._id}`}>Edit</Link>
                            <button onClick={() => dispatch(fetchPostDelThunk(value._id))}>Удаление</button>
                        </li>)
                    :
                    <p>Грузится...</p>
            }
            <Link to={`/create/`}>СОЗДАТЬ СТАТЬЮ</Link>

        </>
    )
}
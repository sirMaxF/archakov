import { useRef } from "react";
import { useDispatch } from "react-redux";
import { regThunk } from '../redux/slices/auth.js';

export const Reg = () => {
    const dispatch = useDispatch();
    const myRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData(myRef.current);
        formData = Object.fromEntries(formData);
        console.log(formData)
        dispatch(regThunk(formData));
    }
    return (
        <form className="cont" onSubmit={handleSubmit} ref={myRef}>
            <p>Имя</p>
            <p><input type="text" name="name"></input></p>
            <p>Почта</p>
            <p><input type="email" name="email"></input></p>
            <p>Пароль</p>
            <p><input type="password" name="password"></input></p>
            <p><input type="submit" value="Регистрация" id="" /></p>
        </form>
    )
}
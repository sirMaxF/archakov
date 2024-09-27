import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import { useRef, useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export const Create = () => {
    // const myRef = useRef(null);
    const navigate = useNavigate();

    const [valueMDE, setValueMDE] = useState("Initial value");
    const [imageUrl, setImageUrl] = useState('');
    const [textValue, setTextValue] = useState('');


    const onChangeMDE = useCallback((valueMDE) => {
        setValueMDE(valueMDE);
    }, []);


    async function handleSubmit(e) {
        e.preventDefault();
        const fields = {
            title: textValue,
            text: valueMDE,
            tags: 'Случайное значение',
            imageUrl: imageUrl,
        }
        const response = await fetch('http://localhost:8000/posts/', {
            method: 'POST',
            headers: {
                'Authorization': window.localStorage.getItem('token'),
                "Content-Type": "application/json",

            },
            body: JSON.stringify(fields)
        });

        const { _id } = await response.json();
        navigate(`/`);
    }

    async function handleChangeFile(e) {
        try {
            const formData = new FormData();
            const file = e.target.files[0];
            console.log(file)

            formData.append('image', file);
            console.log([...formData])


            const response = await fetch('http://localhost:8000/upload/', {
                method: 'POST',
                headers: {
                    'Authorization': window.localStorage.getItem('token'),
                },
                body: formData
            });

            const result = await response.json();

            setImageUrl(result.message);
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form className="editform" onSubmit={handleSubmit}>
            <p>Редактирование статьи</p>
            <p><input type='text' name='text' onChange={(e) => setTextValue(e.target.value)}></input></p>
            <input name='image' type='file' onChange={handleChangeFile}></input>
            <SimpleMDE value={valueMDE} onChange={onChangeMDE} textareaProps={{ name: 'simplemde' }}></SimpleMDE>
            <p><input type='submit' value='Опубликовать'></input></p>
        </form>
    )
}
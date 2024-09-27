import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Markdown from 'react-markdown';

export const SinglePost = () => {
    const params = useParams();
    const posts = useSelector(state => state.posts.posts.items);
    const post = posts.filter(value => value._id === params.id);

    console.log(posts);
    return (
        <>
            <h1>Пост</h1>
            {post.map(value =>
                <li key={value._id}>
                    <p>{value.title}</p>
                    <p><Markdown children={value.text}></Markdown></p>
                </li>
            )}
        </>
    )
}
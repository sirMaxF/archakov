import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! удаление поста
export const fetchPostDelThunk = createAsyncThunk('posts/postDeleted', async (id) => {
    const response = await fetch('http://localhost:8000/posts/' + id, {
        method: 'delete',
        headers: {
            'Authorization': window.localStorage.getItem('token'),
        }
    });

    const result = await response.json();
    console.log('Результат удаления статьи' + result.id)
    return result;
})

//! загрузка списка постов
export const fetchPostsThunk = createAsyncThunk(
    'posts/postsAdded',
    async () => {
        const response = await fetch('http://localhost:8000/posts/',
            //     {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': window.localStorage.getItem('token'),
            //         'Content-Type': 'application/x-www-form-urlencoded'

            //     }
            // }
        );
        const result = await response.json();
        return result;
    },

    // избегаем двойной выдачи данных (из за связки с useEffect)
    {
        condition(arg, thunkApi) {
            const status = thunkApi.getState().posts.posts.status;
            if (status !== 'loading') {
                return false;
            }
        }
    }
)

// состояние по умолчанию
const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
};

// код слайса
const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducer: {},
    extraReducers: builder => {
        builder// ниже код для показа всех статей
            .addCase(fetchPostsThunk.pending, ((state, action) => {
                state.posts.status = 'pending'
            }))
            .addCase(fetchPostsThunk.fulfilled, ((state, action) => {
                state.posts.status = 'fulfilled';
                state.posts.items.push(...action.payload);
            }))
            .addCase(fetchPostsThunk.rejected, ((state, action) => {
                state.posts.status = 'rejected'
            })) // ниже код для удаления статьи
            .addCase(fetchPostDelThunk.pending, ((state, action) => {
                state.posts.status = 'pending'
            }))
            .addCase(fetchPostDelThunk.fulfilled, ((state, action) => {
                state.posts.status = 'fulfilled';
                state.posts.items = state.posts.items.filter(value => value._id !== action.payload.id);
            }))
            .addCase(fetchPostDelThunk.rejected, ((state, action) => {
                state.posts.status = 'rejected'
            }))

    }

});

export const postReducer = postSlice.reducer;
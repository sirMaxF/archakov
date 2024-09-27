import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    status: 'loading'
}

//! запрос на авторизацию
export const authThunk = createAsyncThunk('auth/authDataAdded', async (data) => {
    const response = await fetch('http://localhost:8000/auth/login/'
        , {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();

    if ('token' in result) {
        window.localStorage.setItem('token', result.token)
    }

    return result;
})

//! запрос на проверку, автризован ли пользователь

export const checkAuthThunk = createAsyncThunk('auth/checkAuth', async () => {
    const response = await fetch('http://localhost:8000/auth/me', {
        method: 'POST',
        headers: {
            'Authorization': window.localStorage.getItem('token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const result = await response.json();
    return result;
})

//! регистрация

export const regThunk = createAsyncThunk('auth/Reg', async (data) => {
    const response = await fetch('http://localhost:8000/auth/register/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(result)
    return result;
})


//! слайс 
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: state => { state.data = null }
    },
    extraReducers: builder => {
        builder
            .addCase(authThunk.pending, ((state, action) => {
                state.status = 'pending'
            }))
            .addCase(authThunk.fulfilled, ((state, action) => {
                state.data = action.payload;
                state.status = 'fulfilled'
            }))
            .addCase(authThunk.rejected, ((state, action) => {
                state.status = 'rejected';
            })) // ниже обработка проверки регистрации пользователя
            .addCase(checkAuthThunk.pending, ((state, action) => {
                state.status = 'pending'
            }))
            .addCase(checkAuthThunk.fulfilled, ((state, action) => {
                state.data = action.payload;
                state.status = 'fulfilled'
            }))
            .addCase(checkAuthThunk.rejected, ((state, action) => {
                state.status = 'rejected';
            })) // ниже работа с регистрацией пользователя
            .addCase(regThunk.pending, ((state, action) => {
                state.status = 'pending'
            }))
            .addCase(regThunk.fulfilled, ((state, action) => {
                state.data = action.payload;
                state.status = 'fulfilled'
            }))
            .addCase(regThunk.rejected, ((state, action) => {
                state.status = 'rejected';
            }))
    }
});

// отслеживаем сообщение которое посылает сервер при попытке зайти
// см файл controllers\UserController.js
// там указано чтопри успешном входе система отправляет сообщение ...user._doc с инфой о пользователе
// в том числе его имя. Оно попадает в state.auth.data?.name

export const selectAuth = state => Boolean(state.auth.data?.name);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
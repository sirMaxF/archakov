import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { authValidator, loginValidator, postValidator } from './validations.js';
import { UserController, PostController } from './controllers/index.js'

import { handleValidationErrors, checkAuth } from './utils/index.js';

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/usersdb");
})();

//! загрузка файлов
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const loadHandler = multer({
    storage: storageConfig
});

app.post('/upload/', checkAuth, loadHandler.single('image'), (req, res) => {
    res.json({
        message: req.file.originalname
    })
})

app.use('/uploads/', express.static('uploads'));

//! работа с пользователем
// регистрация пользователя
app.post('/auth/register/', authValidator, handleValidationErrors, UserController.register);

// вход

app.post('/auth/login/', loginValidator, handleValidationErrors, UserController.login);

// проверка авторизован ли поььзователь

app.get('/auth/me', checkAuth, UserController.getMe)

//! работа со статьями

// создание
app.post('/posts/', checkAuth, postValidator, handleValidationErrors, PostController.create);

// получение всех статей
app.get('/posts/', PostController.getAll);

// получение одной статьи
app.get('/posts/:id/', PostController.getOne);

// удаление статьи
app.delete('/posts/:id/', checkAuth, PostController.deletePost);

// обновление статьи
app.put('/posts/:id/', checkAuth, postValidator, handleValidationErrors, PostController.updatePost);

//! сервер
app.listen(8000);

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit();
})
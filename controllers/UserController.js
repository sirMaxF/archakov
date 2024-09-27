import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';
import { Link } from 'react-router-dom'


export const register = async (req, res) => {
    try {
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json(validationResult(req).array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new userModel({
            name: req.body.name,
            email: req.body.email,
            passwordHash
        })

        const user = await doc.save();
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            })

        res.json({
            ...user._doc, // с помощью флага _doc получаем из бд только нужную информацию, без технических деталей
            message: 'Получилось',
            token
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось зарегистрироваться"
        })
    }
};

export const login = async (req, res) => {
    try {

        // получаем полльзователя из бд
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        // проверяем пароль
        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неправильный логин или пароль'
            })
        }

        // предоставляем токен
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            });

        // отпраляем ответ
        res.json({
            ...user._doc,
            token
        })

    } catch (error) {
        res.status(500).json({
            message: 'Не удалась авторизация'
        })
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.id);

        if (!user) {
            return res.status(404).json({
                messge: 'Пользователь не найден'
            })
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}
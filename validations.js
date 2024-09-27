import { body } from 'express-validator';

// валидация при регистрации
export const authValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Недостаточная длина пароля').isLength({ min: 5 })
];

// валидация при входе
export const loginValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Недостаточная длина пароля').isLength({ min: 5 })
];

// валидация при создании статьи

export const postValidator = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите содержание статьи').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]
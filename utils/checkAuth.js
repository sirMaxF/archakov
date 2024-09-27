import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {

        try {
            const decoded = jwt.verify(token, 'secret123');

            // получаем зашифрованную в токене информацию (в данном случае это id)
            // и затем передаем ее в объет req
            req.id = decoded._id;

            next();

        } catch (error) {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    }

    else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}
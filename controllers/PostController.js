import postModel from '../models/Post.js';

// получить все статьи
export const getAll = async (req, res) => {
    try {
        const posts = await postModel.find({}).populate('user').exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

// создание статьи
export const create = async (req, res) => {
    try {
        const doc = new postModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.id, // получаем после проверки авторизации, см файл checkAuth.js
        });

        const post = await doc.save();
        const id = await post._id;

        res.json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

// получить одну статью
export const getOne = async (req, res) => {
    try {
        const post = await postModel.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after'
            },
            // (err, doc) => {

            //     // если возникла ошибка при получении статьи
            //     if (err) {
            //         return res.status(500).json({
            //             message: 'Не удалось вернуть статью'
            //         })
            //     }

            //     // если такой статьи нет
            //     if (!doc) {
            //         return res.status(404).json({
            //             message: 'Статья не найдена'
            //         })
            //     }

            //     // если все хорошо, возвращаем статью
            //     res.json(doc)
            // }
        );

        res.json(post);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось вернуть статью2'
        })
    }
};

// удаление статьи
export const deletePost = async (req, res) => {
    try {
        const postDeleted = await postModel.findOneAndDelete({
            _id: req.params.id
        })

        const idDeleted = postDeleted._id.toString();

        res.json({
            id: idDeleted,
            succsess: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
};

// обновление статьи
export const updatePost = async (req, res) => {
    try {
        const post = await postModel.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
            });

        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}
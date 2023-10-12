import PostModel from "../models/post.js";

//получение всех статей
export const getAll = async (req, res) => {
    try {
        //подключение связи
        const posts = await PostModel.find().populate('user').populate('comments').exec();

        res.json(posts)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}
//получение всех тегов
export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}
//получение одной статьи
export const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findByIdAndUpdate(
            postId,
            { $inc: { viewsCount: 1 } },
            { new: true }
        )
            .populate('user').populate('comments') // Перенесен сюда
            .exec();

        if (!doc) {
            return res.status(404).json({ message: "Статья не найдена" });
        }

        res.json(doc);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Не удалось получить статью" });
    }
};

//удаление статьи
export const removePost = async (req, res) => {
    const postId = req.params.id;

    try {
        const doc = await PostModel.findByIdAndDelete(postId);
        if (!doc) {
            return res.status(404).json({ message: "Статья не найдена" });
        }

        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Не удалось удалить статью"
        });
    }
};
//создание статьи
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(","),
            imageUrl: req.body.imageUrl,
            user: req.userId
        })
        const post = await doc.save()

        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

//обновление статей
export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {
                _id: postId
            }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.body.user,
            tags: req.body.tags.split(','),
        }
        )
        res.json({
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Не удалось обновить статьи"
        })

    }
}
//обновление статей


export const getPostsByTag = async (req, res) => {
    const tag = req.query.tag;
    const tags = tag.split(' ');
  
    try {
      // Используйте регулярное выражение для сопоставления тегов в базе данных
      const articles = await PostModel.find({
        tags: {
          $regex: tags.map(tag => `#${tag.replace('#', '')}`).join('|'),
        }
      });
  
      res.json(articles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка поиска статей' });
    }
}

//получение популярных статей
export const getPopulatePost = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ viewsCount: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}

//сортировка постов новые
export const getNewPost = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
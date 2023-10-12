import CommentsModel from '../models/comments.js'
import PostModel from '../models/post.js'



export const getAllComments = async (req, res) => {
    try {
        const postId = req.params.postId
        if (!postId) {
            res.status(500).json({
                messages: 'Пользаватель не найден'
            })
        }
        const comments = await CommentsModel.find({ post: postId }).populate('user')
        res.json(comments)
    } catch (error) {
        console.log(error)
        res.status(500).jsom({
            message: 'Ошибка сервера'
        })


    }
}

export const createComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Пост не найден' });
        }

        const doc = new CommentsModel({
            post: post._id,
            text: req.body.text,
            user: req.userId,
            imageUrl: req.body.imageUrl
        });
        const comment = await doc.save();

        post.comments.push(comment);
        await post.save();

        res.status(201).json(comment);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Ошибка сервера'
        })
    }
}

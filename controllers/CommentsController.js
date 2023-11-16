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
    console.log(req.params.userId)
    try {
        const postId = req.params.postId;
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Пост не найден' });
        }

        const doc = new CommentsModel({
            post: post._id,
            text: req.body.comment,
            user: req.body.userId,
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

// Получить комментарии для определенного поста
export const getAllPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!postId) { res.status(500).json({ error: 'Ошибка сервера' }) }
        const comments = await CommentsModel.find({ post: postId }).populate('user');
        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
// export const deleteComment = async (req, res) => {
//     try {
//       const commentId = req.params.commentId;
//       const comment = await CommentsModel.findById(commentId);
  
//       if (!comment) {
//         return res.status(404).json({ error: 'Комментарий не найден' });
//       }
  
//       const postId = comment.post;
//       const post = await PostModel.findById(postId);
  
//       if (!post) {
//         return res.status(404).json({ error: 'Связанный пост не найден' });
//       }
  
//       // Удалите комментарий из массива комментариев поста
//       post.comments = post.comments.filter((c) => c.toString() !== commentId);
//       await post.save();
  
//       // Удалите сам комментарий
//       await comment.remove();
  
//       res.status(200).json({ message: 'Комментарий успешно удален' });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Ошибка сервера' });
//     }
//   };
export const deleteComment = async (req, res) => {
    const postId = req.params.commentId;

    try {
        const doc = await CommentsModel.findByIdAndDelete(postId);
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
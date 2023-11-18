import express from "express"
import { commentsValidation, loginValidation, postCreateValidation, registerValidation } from "./validations.js"
import mongoose from "mongoose"
import fs from 'fs'
import cors from 'cors'
import checkAuth from "./Utils/checkAuth.js"
import { getMe, login, register } from "./controllers/UserController.js"
import { create, getAll, getLastTags, getNewPost, getOnePost, getPopulatePost, getPostsByTag, removePost, update } from "./controllers/PostController.js"
import multer from "multer"
import handleValidationErrors from './Utils/handleErrors.js'
import { createComments, deleteComment, getAllPost } from "./controllers/CommentsController.js"


// 'mongodb+srv://admin:Qwer_1234@cluster0.wy8ihwv.mongodb.net/blog2?retryWrites=true&w=majority'
//подключение базы данных mongodb
mongoose.connect(
    process.env.mongodb_API
).then(() => console.log('db ok'))
    .catch((err) => console.log('db err', err))

//создание express приложения
const app = express()

//создания хранилища картинок
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

export const upload = multer({ storage })

//подключаем json формат и теперь его начинает понимать приложение
app.use(express.json())
//показ картинок при запросе
app.use('/uploads', express.static('uploads'))

//разрешение позволяющее делать кросдоменные запросы
app.use(cors())

//роутинг

//авторизация 
app.post('/auth/login', loginValidation, handleValidationErrors, login)
//регистрация
app.post('/auth/register', registerValidation, handleValidationErrors, register)
//инфо о нас
app.get('/auth/me', checkAuth, getMe)


//загрузка картинки
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})


//создание поста
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create)
//получение всех постов
app.get('/posts', getAll)
//получение определенной статьи
app.get('/posts/:id', getOnePost)
//удаление поста
app.delete('/post/:id', checkAuth, removePost)
// обновление статьи
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update)
//получение тегов
app.get('/tags', getLastTags)
//получение  статей по тегу 
app.get('/articlesbytag', getPostsByTag)
//получение статей по популярности
app.get('/populate', getPopulatePost)
//сортировка постов новые
app.get('/new', getNewPost)


//создание комментария
app.post('/posts/:postId/comment', commentsValidation, createComments);
//получение всех комментариев
// app.get('/posts/:postId/comments', commentsValidation,getAllComments);
//удаление коомментария
app.delete('/comments/:commentId', deleteComment);
//получение поста с юзером
app.get('/posts/:postId/comments', getAllPost);


//создание порта
app.listen(process.env.mongodb_API || 4444, (err) => {
    if (err) {
        return console.warn(err)
    }
    console.log('serwer ok')
})
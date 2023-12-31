import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { config } from "dotenv";
import fs from 'fs';
import cors from 'cors';

import { commentsValidation, loginValidation, postCreateValidation, registerValidation } from "./validations.js";
import checkAuth from "./Utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";
import { create, getAll, getLastTags, getNewPost, getOnePost, getPopulatePost, getPostsByTag, removePost, update } from "./controllers/PostController.js";
import handleValidationErrors from './Utils/handleErrors.js';
import { createComments, deleteComment, getAllComments, getAllPost } from "./controllers/CommentsController.js";


const app = express();
const PORT = '4444';
app.use(express.json());
app.use(cors());
config()
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', 'https://frontblog-delta.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


mongoose.connect(process.env.MONGODB_URL).then(() => console.log('db ok'))
    .catch((err) => console.log('db err', err))


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


//роутинг

//авторизация 
app.post('/auth/login', loginValidation, handleValidationErrors, login)
//регистрация
app.post('/auth/register', registerValidation, handleValidationErrors, register)
//инфо о нас
app.get('/auth/me', checkAuth, getMe)

//показ картинок при запросе
app.use('/uploads', express.static('uploads'))
//загрузка картинки
app.use('/upload', (req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'https://frontblog-henna.vercel.app/');
    next();
  });
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
//создание порта
app.listen(process.env.PORT || PORT, (err) => {
    if (err) {
        return console.warn(err)
    }
    console.log('serwer ok')
})
export default app

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
app.get('/posts/:postId/comments', commentsValidation,getAllComments);
//удаление коомментария
app.delete('/comments/:commentId', deleteComment);
//получение поста с юзером
app.get('/posts/:postId/comments', getAllPost);


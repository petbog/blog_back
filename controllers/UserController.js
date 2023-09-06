import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from "../models/user.js"

//регистрация
export const register = (async (req, res) => {
    try {

        //шифрование пароля
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hach = await bcrypt.hash(password, salt);

        const doc = new userModel({
            email: req.body.email,
            passwordHash: hach,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        },
            //ключ шифрования токена
            'secret123',
            {
                //время жизни токера 
                expiresIn: '30d'
            })

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось зарегистрироваться"
        })
    }
})

//авторизация 
export const login = (async (req, res) => {
    try {

        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return req.status(404).json({
                message: "Пользователь не найден"
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }
        const token = jwt.sign({
            _id: user._id
        },
            //ключ шифрования токена
            'secret123',
            {
                //время жизни токера 
                expiresIn: '30d'
            })

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось войти"
        })
    }
})

//инфо о нас
export const getMe=( async (req, res) => {
    try {

        const user = await userModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }

        const { passwordHash, ...userData } = user._doc

        res.json(userData)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Нет доступа"
        })
    }
})
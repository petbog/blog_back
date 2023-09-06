import Jwt from "jsonwebtoken";


//проверка токена на авторизацию пользователя
export default (req, res, next) => {

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = Jwt.verify(token, 'secret123')
            req.userId = decoded._id
            next()
        } catch (error) {
            console.warn(error)
            res.status(403).json({
                message: "Нет доступа"
            })
        }

    } else {
        return res.status(403).json({
            message: 'нет доступа'
        })
    }
}
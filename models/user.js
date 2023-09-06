import mongoose from "mongoose";

//это схема в которой описываются данные которын могуть быть в пользователя

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        //уникальная почта unique
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String
}, {
    //автоматическая дата создания пользователя
    timestamps: true,
})

export default mongoose.model('User', UserSchema)
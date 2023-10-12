import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        require: true,
    },
    text: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true
})


export default mongoose.model('Comments',CommentsSchema)
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true
    },
    tags: {
        type: Array,
        default: []
    }, viewsCount: {
        type: Number,
        default: 0
    },
    user: {
        //связь между моделями для получения id,но надо ее еще подключить
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
        
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments',
        default: [],
    }],
    imageUrl: String
}, {
    timestamps: true,
})

export default mongoose.model('Post', PostSchema)
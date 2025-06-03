import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
    commentuserid: { type: mongoose.Schema.Types.ObjectId },
    commentusersname: { type: String },
    comment: { type: String },
    commentDate: { type: Date }
})

const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    likes: {
        type: Number,
        required: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: CommentsSchema
    }]
})

export default mongoose.model('Post', PostSchema);
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 10

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userimage:{
        type: String,
        required: true,
    },
    userimgid: {
        type: String,
        required: true,
    },
    session: {
        type: String
    }
});

// User.create() -> pre('save') -> insertOne()
UserSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
});

export const comparePassword = async( pw, user ) => {
    return await bcrypt.compare( pw, user.password );
}

export default mongoose.model('User', UserSchema);
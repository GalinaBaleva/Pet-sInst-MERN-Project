import mongoose from 'mongoose';
const {DB_URL, DB_NAME} = process.env;

const connect = async () => {
    await mongoose.connect(DB_URL, { dbName: DB_NAME });
    console.log('MongoDB connected.');
}

export { connect };

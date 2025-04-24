import mongoose from 'mongoose';
const {DB_URL, DB_NAME} = process.env;

const connect = async() => {
    try {
        await mongoose.connect(DB_URL, {dbName: DB_NAME});
        console.log('Mongo BD connected.');

    } catch (error) {
        console.log( 'Mongo DB Error', error );
    }
}

export { connect };

import session from 'express-session';
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GooleStrategy from 'passport-google-oauth20';
import { getUser } from '../user/controller.js';

function enableSessions() {

    return (session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
            dbName: process.env.DB_NAME,
            ttl: 60 * 15, // 15 minutes
            autoRemove: 'native'
        }),
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        }
    }));
}

passport.serializeUser(({ _id }, done) => done(null, { _id }));

passport.deserializeUser(async ({ _id }, done) => {
    const user = await getUser(new mongoose.Types.ObjectId(_id));

    done(null, user);
});

export { enableSessions };


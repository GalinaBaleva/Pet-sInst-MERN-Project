import session from 'express-session';
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import { getUser } from '../user/controller.js';

const isProd = process.env.NODE_ENV === 'production';

function enableSessions() {
    return session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
            dbName: process.env.DB_NAME,
            ttl: 60 * 15,
            autoRemove: 'native'
        }),
        cookie: {
            secure: isProd,
            httpOnly: true,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000
        }
    });
}

export { enableSessions };

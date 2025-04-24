import session from 'express-session';
import mongoose from "mongoose";
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GooleStrategy from 'passport-google-oauth20';
import { getUser } from '../user/controller.js';

function enableSessions(){
    
    return (session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true, // Cookie wird gesetzt, ohne Info
        cookie: {
            secure: false, //https
            httpOnly: true,
            sameSite: 'strict'
        }
    }));
}

passport.serializeUser(({_id}, done) => done(null, {_id}));

passport.deserializeUser(async({_id}, done)=> {
    const user = await getUser(new mongoose.Types.ObjectId({_id}));

    done(null, user);
});

export { enableSessions };


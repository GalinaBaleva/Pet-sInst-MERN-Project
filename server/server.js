import 'dotenv/config';
import express, { urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import * as db from './utils/db.js'
import userRoutes from './user/router.js'
import postsRoutes from './posts/router.js'
import { enableSessions } from './utils/auth.js';

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const { PORT } = process.env;

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://kit.fontawesome.com"],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://kit-free.fontawesome.com",
                    "https://ka-f.fontawesome.com",
                    "https://fonts.googleapis.com",
                ],
                fontSrc: [
                    "'self'",
                    "https://ka-f.fontawesome.com",
                    "https://kit-free.fontawesome.com",
                    "https://fonts.gstatic.com",
                ],
                connectSrc: [
                    "'self'",
                    "https://kit.fontawesome.com",
                    "https://ka-f.fontawesome.com",
                    process.env.CLIENT_ORIGIN,
                ].filter(Boolean),
                imgSrc: ["'self'", "https://res.cloudinary.com", "data:"],
                objectSrc: ["'none'"],
            },
        },
    })
);

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || false,
    credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(urlencoded({ extended: true, limit: '1mb' }));

// Block NoSQL injection: strips $ and . from req.body, req.query, req.params
app.use(mongoSanitize());

app.use(enableSessions());

app.use((req, res, next) => {
    if (isProd) return next();
    console.log(new Date().toLocaleTimeString(), req.method, req.path);
    next();
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many attempts, please try again in 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const commentLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { message: 'Too many comments, slow down' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/user', userRoutes);
app.use('/posts', postsRoutes);

try {
    await db.connect();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
} catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
}

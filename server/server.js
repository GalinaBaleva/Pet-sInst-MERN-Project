import 'dotenv/config';
import express, { urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './utils/db.js'
import userRoutes from './user/router.js'
import postsRoutes from './posts/router.js'
import { enableSessions } from './utils/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// Block NoSQL injection — sanitize in-place (Express 5 req.query is a read-only getter,
// but mutating the object it points to works fine).
app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    if (req.query) mongoSanitize.sanitize(req.query);
    next();
});

app.use(enableSessions());

app.use((req, res, next) => {
    if (isProd) return next();
    console.log(new Date().toLocaleTimeString(), req.method, req.path);
    next();
});

app.use('/user', userRoutes);
app.use('/posts', postsRoutes);

if (isProd) {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

try {
    await db.connect();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
} catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
}

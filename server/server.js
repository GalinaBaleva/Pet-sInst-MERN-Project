import express, { urlencoded } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';

import * as db from './utils/db.js'
import userRoutes from './user/router.js'
import postsRoutes from './posts/router.js'
import { enableSessions } from './utils/auth.js';


const app = express();
const { PORT } = process.env;

try {
    await db.connect();
    app.listen(PORT, () => console.log(`Server is listenig on: http://localhost:${PORT}`));

} catch (error) {
    console.log('Mongo DB Error', err);
}


app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "style-src 'self' 'unsafe-inline' https://kit-free.fontawesome.com https://ka-f.fontawesome.com",
                    "https://kit.fontawesome.com",
                    "https://ka-f.fontawesome.com",
                    "https://pet-sinst-mern-project.onrender.com"
                ],
                styleSrc: [
                    "'self'",
                    "style-src 'self' 'unsafe-inline' https://kit-free.fontawesome.com https://ka-f.fontawesome.com",
                    "'unsafe-inline'", // Required for some FontAwesome styles
                    "https://kit-free.fontawesome.com",
                    "https://ka-f.fontawesome.com"
                ],
                fontSrc: [
                    "'self'",
                    "style-src 'self' 'unsafe-inline' https://kit-free.fontawesome.com https://ka-f.fontawesome.com",
                    "https://ka-f.fontawesome.com",
                    "https://kit-free.fontawesome.com https://ka-f.fontawesome.com"
                ],
                connectSrc: [
                    "'self'",
                    "style-src 'self' 'unsafe-inline' https://kit-free.fontawesome.com https://ka-f.fontawesome.com",
                    "https://kit.fontawesome.com",
                    "https://ka-f.fontawesome.com",
                    "https://pet-sinst-mern-project.onrender.com"
                ],
                imgSrc: ["'self'", "https://res.cloudinary.com", "data:"],
                objectSrc: ["'none'"]
            },
        },
    })
);
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.static('react'));
app.use(enableSessions());


app.use(
    (req, res, next) => {
        console.log(new Date().toLocaleTimeString(), req.method, req.path);
        next();
    }
);

app.use(express.json());
app.use(urlencoded({ extended: true }))


app.use('/user', userRoutes);
app.use('/posts', postsRoutes);

// app.get('*',)

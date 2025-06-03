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
    useDefaults: true,
    directives: {
      "default-src": ["'self'", "https://pet-sinst-mern-project.onrender.com"],
      "script-src": ["'self'", "'unsafe-inline'", "https://kit.fontawesome.com"],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://kit-free.fontawesome.com",
        "https://ka-f.fontawesome.com"
      ],
      "font-src": [
        "'self'",
        "https://fonts.gstatic.com",
        "https://ka-f.fontawesome.com"
      ],
      "connect-src": [
        "'self'",
        "https://pet-sinst-mern-project.onrender.com"
      ]
    }
  }
}));

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

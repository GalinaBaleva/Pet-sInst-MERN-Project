import express from 'express';
import helmet from 'helmet';
import cors from 'cors';


import * as db from './utils/db.js'
import userRoutes from './user/router.js'
import { enableSessions } from './utils/auth.js';


const app = express();
const { PORT } = process.env;

try {
    await db.connect();
    app.listen(PORT, () => console.log(`Server is listenig on: http://localhost:${PORT}`));

} catch (error) {
    console.log('Mongo DB Error', err);
}


app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(
    (req, res, next) => {
        console.log(new Date().toLocaleTimeString(), req.method, req.path);
        next();
    }
);

app.use(express.json());
app.use(enableSessions());

app.use('/user', userRoutes)

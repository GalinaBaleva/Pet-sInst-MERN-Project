import User, { comparePassword } from "./model/User.js";

// import jwt from '../lib/jwt.js';


function users() {
    console.log(User.find('users'));
    return User.find('users');
}

export const getUser = async (_id,) => {
    const user = await users().findOne({ _id });
    return user;
}

function creanUserData(user) {
    const { pwhash, ...data } = user;
    return data
}


export const add = async (req, res) => {
    try {
        const { username, password, repeatPassword } = req.body;
        const userByUsername = await User.findOne({ username: username });

        if (userByUsername) {
            throw new Error('User already exists');
        }

        if (req.body.password.length < 4) {
            throw ('Password is t short');
        }

        await User.create({
            username: username,
            password: password,
            repeatPassword: repeatPassword,
        });
        console.log('ok');
        res.status(200).send('');
    } catch (error) {
        console.log('err', error);
        req.status(500).send(error);
    }
}

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (user) {
            const passOK = await comparePassword(req.body.password, user);

            if (passOK) {
                req.session.logged = true;
                req.session.username = user.username;
                req.session.userid = user._id;
                console.log('logged', req.session.id)

                // const payload = {
                //     _id: user._id,
                //     username: user.username,
                // };

                // const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2d'});

                // res.cookie('token', token);
                console.log('ok');
                res.status(200).send('');
            } else {
                console.log('Invalid user or password');
                res.status(404).send('Invalid user or password');
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

export const logout = async (req, res) => {
    req.session.destroy();
    res.status(200).send('');
}

export const checkauth = async (req, res) => {
    if (req.session.logged) {
        res.status(200).send(req.session.username);
    } else {
        res.status(401).send('');
    }
}




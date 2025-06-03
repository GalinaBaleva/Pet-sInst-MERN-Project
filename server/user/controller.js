import cloudinary from "../utils/cloudinary.js";
import User, { comparePassword } from "./model/User.js";

const staticImg = 'http://res.cloudinary.com/dagwnazwa/image/upload/v1747140089/r703zvrhxgsockgmthe9.png';
const staticPublicId = 'r703zvrhxgsockgmthe9';

export const getUser = async (req, res) => {
    try {
        const _id = req.query.userid;

        const user = await User.findById({ _id: _id });

        if (!user) {
            return res.status(404).send({ message: 'User not found!' })
        }
        const cleanUser = {
            _id: user._id,
            username: user.username,
            userimage: user.userimage
        }

        res.status(200).send(cleanUser);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

function createSession(req, user) {
    req.session.logged = true;
    req.session.username = user.username;
    req.session.userid = user._id;

    req.session.save(err => {
        if (err) console.error('Session speichern fehlgeschlagen:', err);
    });
}


export const add = async (req, res) => {
    try {
        const { username, password, repeatPassword } = req.body;
        const userByUsername = await User.findOne({ username: username });

        if (userByUsername) {
            res.status(404).send({ message: 'User already exists!' });
            return;
        }

        if (password.length < 4) {
            res.status(404).send({ message: 'Password is to short' });
            return;
        } else if (password.length > 30) {
            res.status(404).send({ message: 'Password is to long' });
            return;
        }

        if (password !== repeatPassword) {
            res.status(404).send({ message: 'Password missmatch!' });
            return;
        }

        const user = await User.create({
            username: username,
            password: password,
            userimage: staticImg,
            userimgid: staticPublicId,
        });

        createSession(req, user);

        res.status(200).send({
            message: 'Successfully singed up!',
            _id: user._id
        });
    } catch (error) {
        console.log('err', error.message);
        res.status(500).send({ error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user === null) {
            res.status(404).send({ message: 'Invalid user or password' });
            return;
        }

        const passOK = await comparePassword(req.body.password, user);
        if (!passOK) {
            res.status(404).send({ message: 'Invalid user or password' });
            return;
        }

        createSession(req, user);

        res.status(200).send({
            message: 'Successfully logged in!',
            _id: user._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

export const logout = async (req, res) => {
    req.session.destroy();
    res.status(200).send({ message: 'Successfully logged out!' });
}

export const checkauth = async (req, res) => {
    if (req.session.logged) {
        res.status(200).send({ username: req.session.username, userid: req.session.userid });
    } else {
        res.status(401).send({ message: 'Not authorized' });
    }
}

export const changeProfilePassword = async (req, res) => {
    const { id, oldpassword, newpassword } = req.body;

    try {
        if (req.session.userid === id) {
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).send({ message: 'User is not found' });
            }
            const passOK = await comparePassword(oldpassword, user);

            if (!passOK) {
                return res.status(404).send({ message: 'Old password mismatch!' });
            }

            if (newpassword.length < 4) {
                res.status(404).send({ message: 'Password is to short' });
                return;

            } else if (newpassword.length > 30) {
                res.status(404).send({ message: 'Password is to long' });
                return;
            }

            user.password = newpassword;
            await user.save()
            console.log(user)
            res.status(200).send({ message: 'Password is successfully changed!' })
        } else {
            return res.status(404).send({ message: 'You don\'t have permission to change this password' })
        }

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export const changeProfileImage = async (req, res) => {
    const id = req.body.id[0];

    try {
        if (req.session.userid === id) {
            const user = await User.findById(id);

            const result = await cloudinary.uploader.upload(req.file.path);
            if (!result.url && !result.public_id) {
                return res.status(404).send({ message: 'Something went wrong!' })
            }

            if (user.userimgid !== 'r703zvrhxgsockgmthe9') {
                await cloudinary.uploader.destroy(user.userimgid);
            };

            const usernew = await User.findByIdAndUpdate(id, {
                userimage: result.url,
                userimgid: result.public_id
            },
                { new: true });

            console.log(usernew)

            res.status(200).send({ message: 'Image is successfully changed!' });
        } else {
            return res.status(404).send({ message: 'You don\'t have permission to change this image' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message });
    }
};






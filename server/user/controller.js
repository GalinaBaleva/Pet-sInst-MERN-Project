import cloudinary from "../utils/cloudinary.js";
import User, { comparePassword } from "./model/User.js";

const staticImg = 'https://res.cloudinary.com/dagwnazwa/image/upload/v1747140089/r703zvrhxgsockgmthe9.png';
const staticPublicId = 'r703zvrhxgsockgmthe9';

export const getUser = async (req, res) => {
    try {
        const _id = req.query.userid;

        const user = await User.findById(_id);

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

    return new Promise((resolve, reject) => {
        req.session.save(err => {
            if (err) reject(err);
            else resolve();
        });
    });
}


export const add = async (req, res) => {
    try {
        const { username, password, repeatPassword } = req.body;
        const userByUsername = await User.findOne({ username: username });

        if (userByUsername) {
            res.status(409).send({ message: 'User already exists!' });
            return;
        }

        if (password.length < 8) {
            res.status(400).send({ message: 'Password must be at least 8 characters' });
            return;
        } else if (password.length > 30) {
            res.status(400).send({ message: 'Password is too long' });
            return;
        }

        if (password !== repeatPassword) {
            res.status(400).send({ message: 'Password mismatch!' });
            return;
        }

        const user = await User.create({
            username: username,
            password: password,
            userimage: staticImg,
            userimgid: staticPublicId,
        });

        await createSession(req, user);

        res.status(201).send({
            message: 'Successfully signed up!',
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

        await createSession(req, user);

        res.status(200).send({
            message: 'Successfully logged in!',
            _id: user._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ message: 'Logout failed' });
        res.status(200).send({ message: 'Successfully logged out!' });
    });
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
                return res.status(400).send({ message: 'Old password mismatch!' });
            }

            if (newpassword.length < 8) {
                res.status(400).send({ message: 'Password must be at least 8 characters' });
                return;

            } else if (newpassword.length > 30) {
                res.status(400).send({ message: 'Password is too long' });
                return;
            }

            user.password = newpassword;
            await user.save();
            res.status(200).send({ message: 'Password is successfully changed!' })
        } else {
            return res.status(403).send({ message: 'You don\'t have permission to change this password' })
        }

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export const changeProfileImage = async (req, res) => {
    const id = Array.isArray(req.body.id) ? req.body.id[0] : req.body.id;

    if (!req.file) {
        return res.status(400).send({ message: 'No image provided' });
    }

    try {
        if (req.session.userid === id) {
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            const result = await cloudinary.uploader.upload(req.file.path);
            if (!result.url && !result.public_id) {
                return res.status(500).send({ message: 'Something went wrong!' })
            }

            if (user.userimgid !== 'r703zvrhxgsockgmthe9') {
                await cloudinary.uploader.destroy(user.userimgid);
            };

            await User.findByIdAndUpdate(id, {
                userimage: result.url,
                userimgid: result.public_id
            });

            res.status(200).send({ message: 'Image is successfully changed!' });
        } else {
            return res.status(403).send({ message: 'You don\'t have permission to change this image' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message });
    }
};






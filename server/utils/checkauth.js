export const requireAuth = (req, res, next) => {
    if (req.session.userid) {
        next();
    } else {
        res.status(401).send({ message: 'You are not logged in!' });
    }
};

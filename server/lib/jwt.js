import util from 'util';
import jsonwebtoken from 'jsonwebtoken';

const jwt = {
    sign: util.promisify(jsonwebtoken.sign),
    verify: util.promisify(jsonwebtoken.verify),
};

export default jwt;

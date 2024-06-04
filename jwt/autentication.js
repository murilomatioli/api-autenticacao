const e = require('express');
const jwt = require('jsonwebtoken');
const secretKey = 'jsurkfkkisaoasdkajlfiojife9991234sifskdnfsdv890892342jkhsdbhfv';

const nossoToken = jwt.sign(
    {
        email: 'murilo@gmail.com',
        password: '123456',
    },
    secretKey,
    {
        expiresIn: '300',
        subject: '1',
    }
);

module.exports = nossoToken;
module.exports = secretKey;
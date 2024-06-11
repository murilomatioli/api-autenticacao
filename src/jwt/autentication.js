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

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token não informado.' });

    jwt.verify(token, secretKey, function(err, decoded){
        if (err) return res.status(401).json({ auth: false, message: 'Falha ao autenticar o token' });
        req.userId = decoded.userId;
        next();
    });
}

module.exports =  {
    verifyJWT,
    nossoToken,
    secretKey
}
const jwt = require('jsonwebtoken');
const secretKey = 'jsurkfkkisaoasdkajlfiojife9991234sifskdnfsdv890892342jkhsdbhfv';
const User = require('../../db/models/User')

async function verifyJWT (req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token){ 
        return res.status(401).json({ auth: false, message: 'Token não informado.' });
    }



    jwt.verify(token, secretKey, async function(err, decoded){
        if (err) return res.status(401).json({ auth: false, message: 'Falha ao autenticar o token.' });
        req.userId = decoded.userId;
        const id = req.userId
        req.token = token
        const user = await User.findByPk(id)
        console.log("Usuário logado: " + user)

        if(user.profile == 'admin'){
            req.userPermission = 1;

        }
        if(user.profile == 'user'){
            req.userPermission = 0;

        }
        next();
    });
}

module.exports =  {
    verifyJWT,
    secretKey
}
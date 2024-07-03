const jwt = require('jsonwebtoken');
const secretKey = 'jsurkfkkisaoasdkajlfiojife9991234sifskdnfsdv890892342jkhsdbhfv';
const User = require('../../db/models/User')
const BlackList = require('../../db/models/BlackList')


async function verifyJWT (req, res, next) {
    const token = req.headers['x-access-token'];
    const listTokens = await BlackList.findOne({ token })

    if(listTokens){
        return res.status(401).json({ message: "Esse token já fez logout"})
    }
    if (token.length == 0){ 
        return res.status(401).json({ auth: false, message: 'Token não informado.' });
    }



    jwt.verify(token, secretKey, async function(err, decoded){
        if (err) return res.status(401).json({ auth: false, message: 'Falha ao autenticar o token.' });
        req.userId = decoded.userId;
        const id = req.userId
        req.token = token
        const user = await User.findById(id)
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
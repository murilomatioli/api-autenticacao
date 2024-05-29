const express = require('express')
const app = express()
app.use(express.json());
const jwt = require('jsonwebtoken');
const secretKey = require('./jwt/autentication');
require("./config/db/connection");
const User = require('./config/db/models/User');


const nossoToken = require('./jwt/autentication');



function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token não informado.' });

    jwt.verify(token, secretKey, function(err, decoded){
        if (err) return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });

        req.userId = decoded.userId;
        next();
    });
}

app.get('/', verifyJWT, (req, res) => {
    console.log('Acessou a rota com sucesso!')  
    res.json({message: 'Esse é o token!', token: nossoToken})
})

app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        const userSave = await newUser.save();
        const tokenAutenticacao = jwt.sign(
            {
                userId: userSave._id,
            },
            secretKey,
            {
                expiresIn: 300,
            });
        res.json({
            auth: true,
            tokenAutenticacao
        })
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
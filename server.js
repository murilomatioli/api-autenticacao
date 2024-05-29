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
        res.json(userSave);
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (err){
        res.status(401).json({ message: err.message});
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username })
        const findPassword = await User.findOne({ password })
        if(!user) {
            return res.status(402).json({ message: "Username incorreto"});
        }
        if(!findPassword) {
            return res.status(403).json({ message: "Senha incorreta"})
        }
        if(user && findPassword){
            const tokenAutenticacao = jwt.sign(
                {
                    userId: user._id,
                },
                secretKey,
                {
                    expiresIn: 300,
                });
            res.json({
                message: `Autenticado como ${username}!`,
                auth: true,
                /*tokenAutenticacao*/
            })
           /* return res.status(200).json({ message: "Autenticado como " + req.body.username});*/
        }
    } catch (err){
        return res.status(500).json({ message: "Erro com o servidor"});
    }
})
app.delete('/users', async (req, res) => {
    try {
        const deleteUser = await User.deleteMany({});
        if(deleteUser.deletedCount == 0){
            return res.json({ message: "Não há usuários para deletar"});
        }else{
            return res.json({ message: `${deleteUser.deletedCount} usuários deletados`})
        }
        
    } catch{
        return res.json({ message: "Erro"});
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
const express = require('express')
const app = express()
app.use(express.json());
const jwt = require('jsonwebtoken');
const secretKey = require('./jwt/autentication');
require("./config/db/connection");
const User = require('./config/db/models/User');

//importa bcrypt e define 10 a complexidade da criptografia
const bcrypt = require('bcrypt')
const saltRounds = 10;



const nossoToken = require('./jwt/autentication');



function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token não informado.' });

    jwt.verify(token, secretKey, function(err, decoded){
        if (err) return res.status(401).json({ auth: false, message: 'Falha ao autenticar o token.' });
        req.userId = decoded.userId;
        next();
    });
}


app.get('/', verifyJWT, (req, res) => {
    res.json({
        message: 'Acessou a rota com sucesso! Esse é o token: ', 
        token: nossoToken,
    })
})

app.post('/users', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        /*console.log('Senha criptografada: ', hash);*/

        const newUser = new User({ username, password: hash });
        const userSave = await newUser.save();

        res.json(userSave);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        if(users.length > 0){
            res.status(200).json(users)
        }else{
            res.status(403).json({ message: "Não há usuários"})
        }
        
    } catch (err){
        res.status(401).json({ message: err.message});
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username })
        const senhaCorreta = await bcrypt.compare(password, user.password)
        console.log(senhaCorreta)
        if(!senhaCorreta) {
            return res.status(403).json({ message: "Usuário ou senha incorretos"});
        }
        if(user && senhaCorreta){
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
                tokenAutenticacao
            })
           /* return res.status(200).json({ message: "Autenticado como " + req.body.username});*/
        }
    } catch (err){
        return res.status(403).json({ message: "Usuário ou senha incorretoss"});
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
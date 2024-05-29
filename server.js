const express = require('express')
const app = express()
app.use(express.json());

require("./config/db/connection");
const User = require('./config/db/models/User');
const nossoToken = require('./jwt/autentication')

app.get('/', (req, res) => {
    res.json({message: 'Esse é o token!', token: nossoToken})
    
})


app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        const userSave = await newUser.save();
        res.status(201).json(userSave);
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
            return res.status(200).json({ message: "Autenticado como " + req.body.username});
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
const express = require('express')
const app = express()
app.use(express.json());

require("./config/db/connection");
const User = require('./config/db/models/User');


app.get('/', (req, res) => {
    res.json({ message: "Olá mundo" })
})


app.post('/users', async (req, res) => {
    const { username, senha } = req.body;
    try {
        const newUser = new User({ username, senha });
        const userSave = await newUser.save();
        res.status(201).json(userSave);
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
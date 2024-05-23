port = 3000;

const express = require('express')
const app = express()

const nossoToken = require('./jwt/autentication')

app.get('/', (req, res) => {
    res.json({message: 'Esse é o token!', token: nossoToken})
    
})

app.listen(port); {
    console.log('Server is running on port ' + port);
}
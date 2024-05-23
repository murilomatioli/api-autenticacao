const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    username: String,
    senha: String,
})

module.exports = mongoose.model("users", userSchema)
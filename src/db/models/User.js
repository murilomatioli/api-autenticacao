const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: [true, "O nome de usuário é obrigatório"],
        unique: false,
    },
    password: {
        type: String,
        required: [true, "A senha é obrigatória"],
        unique: false,
        minlength: [8, "A senha deve conter pelo menos 8 caracteres"],
    },
    email: {
        type: String,
        required: [true, "Email é obrigatório"],
        unique: [true, "Email ja cadastrado"],
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    profile: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cpf: {
        type: String,
        minlength: [11, "O CPF deve contar com 11 caracteres."],
        maxlength: [11, "O CPF deve contar com 11 caracteres."],
        unique: [true, "CPF já cadastrado"]
    }
})

module.exports = mongoose.model("users", userSchema)
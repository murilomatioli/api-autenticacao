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
        minlength: [11, "O CPF tem menos de 11 caracteres."],
        maxlength: [14, "O CPF tem mais que 14 caracteres."],
        unique: [true, "CPF já cadastrado"]
    },
    cep: {
        type: String,
        minlength: [8, "O cep tem menos que 8 caracteres"],
        maxlength: [9, "O cep tem mais que 8 caracteres"],
        required: true
    },
    celular: {
        type: String,
        minlength: [11, "Telefone celular com menos de 11 caracteres"],
        unique: true
    },
    fixo: {
        type: String,
        minlength: [10, "O fixo tem menos de 10 caracteres"]
    }
})

module.exports = mongoose.model("users", userSchema)
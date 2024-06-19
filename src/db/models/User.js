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
    },
    cpf: {
        type: String,
        minlength: [11, "O CPF é inválido."],
        maxlength: [14, "O CPF é inválido."],
        unique: [true, "CPF já cadastrado"]
    },
    cep: {
        type: String,
        minlength: [8, "Insira um cep válido"],
        maxlength: [9, "Insira um cep válido"],
        required: true
    },
    celular: {
        type: String,
        minlength: [11, "Telefone celular inválido"],
        unique: true
    },
    fixo: {
        type: String,
        minlength: [10, "Telefone fixo inválido"]
    }
})

module.exports = mongoose.model("users", userSchema)
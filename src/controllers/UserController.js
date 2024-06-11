const User = require('../db/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cpfValidator = require('cpf-cnpj-validator');
const { secretKey } = require('../middlewares/jwt/verifyJWT');
const saltRounds = 10;
require("../db/connection");

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(403).json({ message: 'Não há usuários' });
        }
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

const createUser = async (req, res) => {
    const { username, password, email, cpf } = req.body;

    // VALIDAR SENHA
    if (password.length < 8) {
        return res.status(400).json({ message: 'Sua senha deve ter pelo menos 8 caracteres' });
    }

    // VALIDAR CPF
    const cpfValid = cpfValidator.cpf.isValid(cpf);
    if (!cpfValid) {
        return res.status(400).json({ message: 'O CPF é inválido.' });
    }

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hash, email, cpf });
        const userSave = await newUser.save();
        res.json(userSave);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Usuário ou senha incorretos" });
        }

        const senhaCorreta = await bcrypt.compare(password, user.password);
        if (!senhaCorreta) {
            return res.status(403).json({ message: "Usuário ou senha incorretos" });
        }

        const tokenAutenticacao = jwt.sign(
            { userId: user._id },
            secretKey,
            { expiresIn: 300 }
        );

        res.json({
            message: `Autenticado como ${user.username}!`,
            auth: true,
            tokenAutenticacao
        });
    } catch (err) {
        return res.status(403).json({ message: "Usuário ou senha incorretos" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.deleteMany({});
        if (deleteUser.deletedCount === 0) {
            return res.json({ message: 'Não há usuários para deletar' });
        } else {
            return res.json({ message: `${deleteUser.deletedCount} usuários deletados` });
        }
    } catch {
        return res.json({ message: 'Erro' });
    }
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    deleteUser,
};

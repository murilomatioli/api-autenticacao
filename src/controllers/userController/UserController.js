const User = require('../../db/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeCpf = require('node-cpf');
const { secretKey } = require('../../middlewares/jwt/verifyJWT');
const saltRounds = 10;
const format = require('telefone/format')
const parse = require('telefone/parse')
const cepUtil = require('node-cep-util')
require("../../db/connection");
const { verifyJWT } = require('../../middlewares/jwt/verifyJWT');


const getUsers = async (req, res) => {
    try {
        const userPermission = req.userPermission;
        if(userPermission == 0){
            return res.status(401).json({ message: "Não autorizado a acessar esta rota."})
        }

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
const getUserById = async (req, res) => {

    const { id } = req.params
    try {
        const findUserById = await User.findById(id);
        if(!findUserById){
            return res.status(404).json({ message: "Nenhum usuário com esse identificador "})
        }
        return res.status(200).json(findUserById)
    } catch (error) {
        return res.json(error);
    }
}
const getUserByName = async (req,res) => {
    const { username } = req.params;

    try {
    const findUserByName = await User.findOne({ username })
    if(!findUserByName){
        return res.status(404).json({ message: "Não existe ninguém com esse username."})
    }
    return res.status(200).json(findUserByName);
    } catch (error) {
        return res.status(500).json(error)
    }   
};
const getUserByEmail = async (req,res) => {
    const { email } = req.params

    try {
        const findUserByEmail = await User.findOne({ email });
        if(!findUserByEmail){
            return res.status(404).json({ message: "Não existe ninguém com esse email."})
        }
        return res.status(200).json(findUserByEmail)
    } catch (error) {
        return res.status(500).json(error)
    }
}
const createUser = async (req, res) => {
    const { username, password, email, cep, profile } = req.body;
    let { cpf, celular, fixo } = req.body
    // VALIDAR SENHA
    if (password.length < 8) {
        return res.status(400).json({ message: 'Sua senha deve ter pelo menos 8 caracteres' });
    }
    // VALIDA O PROFILE
    if(profile != "admin" && profile != "user"){
        return res.status(400).json({ message: 'Profile inválido'})
    }
    // VALIDAR CPF
    const cpfValid = nodeCpf.validate(cpf);
    if (!cpfValid) {
        return res.status(400).json({ message: 'O CPF é inválido.' });
    }
    const cpfMasked = nodeCpf.isMasked(cpf)
    if(cpfMasked == false){
        console.log(`Não está mascarado! ${cpf}`)
        cpf = nodeCpf.mask(cpf)
        console.log(`Agora está mascarado! ${cpf}`)
    }
    // FORMATAR CELULAR
    celular = parse(celular, {apenasCelular: true})
    if(celular == null){
        return res.status(400).json({ message: 'O número de celular é inválido.' })
    }

    if(celular.length >= 11){
        celular = format(celular)
    }
    // FORMATAR FIXO
    fixo = parse(fixo, {apenasFixo: true})
    if(fixo == null){
        return res.status(400).json({ message: 'O número de telefone fixo é inválido.' })
    }
    if(fixo.length >= 10){
        fixo = format(fixo)
    }

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hash, email, cpf, cep, profile, celular, fixo });

        if(cepUtil.isMasked(newUser.cep) == false){
            newUser.cep = cepUtil.mask(newUser.cep);
        }
        const userSave = await newUser.save();
        return res.json(userSave);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
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
        const usuarioLogado = user.profile
        //console.log(`O usuário que se logou é um ${user.profile}`);

        const tokenAutenticacao = jwt.sign(
            {
                userId: user._id,
            },
            secretKey,
            {
                expiresIn: 1000,
            });
        
        res.json({
            message: `Autenticado como ${user.username}! profile: ${user.profile}`,
            auth: true,
            tokenAutenticacao
        });
    } catch (err) {
        return res.status(403).json({ message: "Usuário ou senha incorretos" });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userPermission = req.userPermission;
        if(userPermission == 0){
            return res.status(401).json({ message: "Não autorizado a acessar esta rota."})
        }
        const deleteUser = await User.deleteMany({ profile: 'user'});
        if (deleteUser.deletedCount === 0) {
            return res.json({ message: 'Não há usuários para deletar' });
        } else {
            return res.json({ message: `${deleteUser.deletedCount} usuários deletados` });
        }
    } catch {
        return res.json({ message: 'Erro' });
    }
};

const deleteAllData = async (req, res) => {
    //deletar todos os usuarios
    try {
        const userPermission = req.userPermission;
        if(userPermission == 0){
            return res.status(401).json({ message: "Não autorizado a acessar esta rota."})
        }
        const deleteUsers = await User.deleteMany({})
        if (deleteUsers.deletedCount === 0) {
            return res.json({ message: 'Não há usuários para deletar' });
        } else {
            return res.json({ message: `${deleteUsers.deletedCount} usuários deletados` });
        }
    } catch {
        return res.json({ message: 'Erro' });
    }
}

const patchUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, email, celular } = req.body;

    try {
        const updateUser = await User.findByIdAndUpdate(id)
        updateUser.username = username;
        updateUser.password = password;
        updateUser.email = email;
        update.User.celular = celular;
        if(!updateUser){
            return res.status(404).json({ message: "Não há nenhum usuário com esse identificador."})
        }
        const newUser = await updateUser.save();
        return res.status(200).json(newUser)
    } catch (error) {
        return res.status(400).json({ message: "Erro com o servidor"})
    }
}
module.exports = {
    getUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
    createUser,
    loginUser,
    deleteUser,
    deleteAllData,
    patchUser,
};

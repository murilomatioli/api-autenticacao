const express = require('express');
const router = express.Router();
const User = require('../../db/models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeCpf = require('node-cpf');
const { secretKey } = require('../../middlewares/jwt/verifyJWT');
const saltRounds = 10;
const format = require('telefone/format');
const parse = require('telefone/parse');
const cepUtil = require('node-cep-util');

const getUsers = async (req, res) => {
  try {
    const userPermission = req.userPermission;
    
    if (userPermission !== 1) { 
      return res.status(401).json({ message: "Não autorizado a acessar esta rota." });
    }
      const users = await User.findAll();
      console.log(users.every(user => user instanceof User)); // true
      return res.status(200).json(JSON.stringify(users, null, 2));
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Nenhum usuário com esse identificador" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserByName = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "Não existe ninguém com esse username." });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Não existe ninguém com esse email." });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { username, password, email, cep } = req.body;
  let { cpf, celular, fixo, profile } = req.body;

  if (password.length < 8) {
    return res.status(400).json({ message: 'Sua senha deve ter pelo menos 8 caracteres' });
  }

  if (profile !== "admin" && profile !== "user") {
    profile = "user";
  }

  const cpfValid = nodeCpf.validate(cpf);
  if (!cpfValid) {
    return res.status(400).json({ message: 'O CPF é inválido.' });
  }
  const cpfMasked = nodeCpf.isMasked(cpf);
  if (!cpfMasked) {
    cpf = nodeCpf.mask(cpf);
  }

  celular = parse(celular, { apenasCelular: true });
  if (celular == null) {
    return res.status(400).json({ message: 'O número de celular é inválido.' });
  }
  if (celular.length >= 11) {
    celular = format(celular);
  }

  fixo = parse(fixo, { apenasFixo: true });
  if (fixo == null) {
    return res.status(400).json({ message: 'O número de telefone fixo é inválido.' });
  }
  if (fixo.length >= 10) {
    fixo = format(fixo);
  }

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      username,
      password: hash,
      email,
      cpf,
      cep,
      profile,
      celular,
      fixo
    });
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(403).json({ message: "Usuário ou senha incorretos" });
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      return res.status(403).json({ message: "Usuário ou senha incorretos" });
    }

    const tokenAutenticacao = jwt.sign(
      { userId: user.id },
      secretKey,
      { expiresIn: '2h' }
    );

    res.json({
      message: `Autenticado como ${user.username}! profile: ${user.profile}`,
      auth: true,
      tokenAutenticacao
    });
  } catch (err) {
    return res.status(500).json({ message: "Erro interno" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.destroy({ where: { id: userId } });
    if (user === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json({ message: `Deletou o próprio usuário` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userPermission = req.userPermission;
    if (userPermission !== 1) { 
      return res.status(401).json({ message: "Não autorizado a acessar esta rota." });
    }

    const { id } = req.params;
    const user = await User.destroy({ where: { id } });
    if (user === 0) {
      return res.status(404).json({ message: 'Não há usuários com esse identificador para deletar' });
    }
    return res.status(204).json({ message: `Usuário deletado` });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno' });
  }
};

const deleteAllData = async (req, res) => {
  try {
    const userPermission = req.userPermission;
    if (userPermission !== 1) {
      return res.status(401).json({ message: "Não autorizado a acessar esta rota." });
    }

    const deletedUsers = await User.destroy({ where: {}, force: true });
    if (deletedUsers === 0) {
      return res.json({ message: 'Não há usuários para deletar' });
    } else {
      return res.json({ message: `${deletedUsers} usuários deletados` });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Erro' });
  }
};

const patchUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, email, celular } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Não há nenhum usuário com esse identificador." });
    }

    const updates = {};
    if (username) updates.username = username;
    if (password) updates.password = await bcrypt.hash(password, saltRounds);
    if (email) updates.email = email;
    if (celular) updates.celular = celular;

    if (Object.keys(updates).length > 0) {
      try {
        const updatedUser = await User.update(updates, {
          where: { id },
          returning: true,
          plain: true
        });
        return res.status(200).json(updatedUser[1]);
      } catch (error) {
        return res.status(400).json({ message: "Erro com o servidor" });
      }
    } else {
      return res.status(400).json({ message: "Nenhuma informação para atualizar." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro com o servidor" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByName,
  login,
  getUserByEmail,
  createUser,
  deleteUser,
  deleteAccount,
  deleteAllData,
  patchUser,
};

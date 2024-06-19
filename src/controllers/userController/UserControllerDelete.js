const User = require('../../db/models/User');
require("../../db/connection");
//deletar usuarios que nao sao adms
const deleteUser = async (req, res) => {
    try {
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
//deletar todos os usuarios
const deleteAllData = async (req, res) => {
    try {
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
module.exports = {
    deleteUser,
    deleteAllData,
}
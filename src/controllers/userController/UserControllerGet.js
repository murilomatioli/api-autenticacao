const User = require('../../db/models/User');
require("../../db/connection");

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
module.exports = {
    getUserByName,
    getUserByEmail
}
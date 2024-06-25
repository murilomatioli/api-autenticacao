const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/jwt/verifyJWT');
const userController = require('../controllers/userController/UserController');

router.get('/', verifyJWT, (req, res) => {
    const userPermission = req.userPermission;
    if(userPermission == 0){
        console.log("Conceder todas as permissões");
        console.log("Logado como user")
        return res.json({ message: "Logado como user"})
    }
    if(userPermission == 1){
        console.log("Limitar permissões");
        console.log("Logado como admin")
        return res.json({ message: "Logado como admin"})
    }

    res.json({ message: 'Acessou a rota com sucesso!' });
});

router.get('/users', verifyJWT, userController.getUsers);
router.get('/users/:id', userController.getUserById)
router.get('/users/username/:username', userController.getUserByName)
router.get('/users/email/:email', userController.getUserByEmail)
router.post('/users', userController.createUser);
router.post('/users/login', userController.loginUser);
router.delete('/users', userController.deleteUser);
router.delete('/users/all', userController.deleteAllData)
router.patch('/users/:id', userController.patchUser)

module.exports = router;

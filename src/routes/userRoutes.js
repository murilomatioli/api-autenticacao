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
});

router.get('/users', verifyJWT, userController.getUsers);
router.get('/users/:id', userController.getUserById)
router.get('/users/username/:username', userController.getUserByName)
router.get('/users/email/:email', userController.getUserByEmail)
router.post('/users', userController.createUser);
router.post('/users/login', userController.loginUser);
router.post('/users/logout', verifyJWT, userController.logoutUser);
router.delete('/users', verifyJWT, userController.deleteUser);
router.delete('/users/own', verifyJWT, userController.deleteAccount)
router.delete('/users/all', verifyJWT, userController.deleteAllData)
router.patch('/users/:id', userController.patchUser)

module.exports = router;

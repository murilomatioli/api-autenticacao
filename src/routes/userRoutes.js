const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/jwt/verifyJWT');
const userController = require('../controllers/userController/UserController');
const userControllerGet = require('../controllers/userController/UserControllerGet')
router.get('/', verifyJWT, (req, res) => {
    res.json({ message: 'Acessou a rota com sucesso!' });
});

router.get('/users', verifyJWT, userController.getUsers);
router.get('/users/:id', userController.getUserById)
router.get('/users/username/:username', userControllerGet.getUserByName)
router.get('/users/email/:email', userControllerGet.getUserByEmail)
router.post('/users', userController.createUser);
router.post('/users/login', userController.loginUser);
router.delete('/users', userController.deleteUser);
router.patch('/users/:id', userController.patchUser)

module.exports = router;

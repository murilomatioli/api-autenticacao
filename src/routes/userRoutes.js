const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/jwt/verifyJWT');
const userController = require('../controllers/UserController');

router.get('/', verifyJWT, (req, res) => {
    res.json({ message: 'Acessou a rota com sucesso!' });
});

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.post('/users/login', userController.loginUser);
router.delete('/users', userController.deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  promoteToAdmin,
} = require('../controllers/userController');

const { auth, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/promote', auth, isAdmin, promoteToAdmin);

module.exports = router;

const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')

router.get('/users', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);
router.put('/changeStatus', authMiddleware, roleMiddleware('admin'), userController.changeUserStatusByAdmin);

module.exports = router
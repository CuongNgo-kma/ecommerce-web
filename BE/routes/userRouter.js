const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register',userCtrl.register)
router.get('/refresh_token',userCtrl.refreshToken)
router.post('/login',userCtrl.login)
router.get('/logout',userCtrl.logout)
router.get('/infor', auth, userCtrl.getUser)
router.delete('/delete/:id', auth,authAdmin, userCtrl.delete)
router.patch('/addcart', auth, userCtrl.addCart)
router.patch('/deletecart', auth, userCtrl.deleteCart)
router.get('/history', auth, userCtrl.history)
router.patch('/updateuser/:id', auth, userCtrl.updateUser)
router.patch('/password/:id', auth, userCtrl.ChangePassword)

module.exports = router

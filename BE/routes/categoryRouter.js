const router = require('express').Router()
const categoryCtrl = require('../controllers/categoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/category')
    .get(categoryCtrl.getCategoryCtrl)
    .post(auth, authAdmin, categoryCtrl.creatCategory)

router.route('/category/:id')
    .delete(auth, authAdmin, categoryCtrl.deleteCaategory)
    .put(auth, authAdmin, categoryCtrl.updateCaategory)

module.exports = router
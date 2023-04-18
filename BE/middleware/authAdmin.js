const Users = require('../models/userModel')

const authAdmin = async (req, res, next) =>{
    try {
        // lấy thông tin user bằng id
        const user = await Users.findOne({
            _id: req.user.id
        })
        if (user.role === 0) {
            return res.status(400).json({msg: "Admin resource access denied"})
        }
        next(); //kiểm tra xác thực tài khoản có quyền admin (role: 1) nếu vượt qua được thì chuyển tiếp sang xác thực token admin auth.js
    } catch (error) {
        return res.status(500).json({msg: error.message})

    }
}
module.exports = authAdmin
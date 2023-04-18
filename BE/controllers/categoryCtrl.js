const Category = require('../models/categoryModel')

const categoryCtrl = {
    getCategoryCtrl: async (req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    creatCategory: async (req, res) => {
        try {
            // chỉ admin mới có quyền tạo, chỉnh sửa và cập nhật
            // tài khoản admin có role = 1
            const { name } = req.body
            const category = await Category.findOne({ name })
            if (category) {
                return res.status(400).json({ msg: "This category already exist." })
            }
            const newCategory = new Category({ name })

            await newCategory.save()
            res.json({ msg: "created a category" })

        } catch (error) {
            return res.status(500).json({ msg: error.message })

        }
    },
    deleteCaategory: async (req, res) => {
        try {

            await Category.findByIdAndDelete(req.params.id)
            res.json({ msg: "Delete a Category" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })

        }
    },
    // login với admin có thể sửa tên thông qua id
    updateCaategory: async (req, res) => {
        try {
            const {name} = req.body
            await Category.findOneAndUpdate({ _id: req.params.id }, { name })
            res.json({ msg: "update Category" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })

        }
    }
}

module.exports = categoryCtrl
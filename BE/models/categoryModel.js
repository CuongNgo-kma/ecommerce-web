const mongoose = require('mongoose')
const categoryCtrl = require('../controllers/categoryCtrl')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        requireed: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Category', categorySchema)
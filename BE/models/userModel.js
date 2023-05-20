const mongoose = require('mongoose')

const useSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar:{
        type: String,
        require: true
    }
    ,
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    }, 
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Users', useSchema)
const mongoose = require('mongoose')

// blueprint of how data is structured in mongodb database
// creating blueprint/template
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    xp: {
        type: Number,
        require: true,
        default: 0
    },
    level: {
        type: Number,
        require: true,
        default: 1
    },
    coins: {
        type: Number,
        require: true,
        default: 0
    },
    badge: {
        type: String,
        require: true,
        default: "",
    },
    color: {
        type: String,
        require: true,
        default: "#808080",
    }
})

module.exports = mongoose.model('userTable', userSchema, 'userTable')
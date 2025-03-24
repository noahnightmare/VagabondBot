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
        required: true,
        default: 0
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    coins: {
        type: Number,
        required: true,
        default: 0
    },
    badge: {
        type: String,
        required: true,
        default: "",
    },
    color: {
        type: String,
        required: true,
        default: "#808080",
    },
    inventory: {
        type: [String], // array of unique strings identifying which objects the user has
        required: true,
        default: []
    }
})

module.exports = mongoose.model('userTable', userSchema, 'userTable')
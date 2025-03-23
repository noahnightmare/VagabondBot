const mongoose = require('mongoose')

// blueprint of how data is structured in mongodb database
// creating blueprint/template
const xpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    xp: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('xpTable', xpSchema, 'xpTable')
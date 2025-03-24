const mongoose = require('mongoose')

// blueprint of how data is structured in mongodb database
// creating blueprint/template
const shopItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        require: true,
    },
    type: { // "badge" or "color"
        type: String,
        require: true,
        enum: ["badge", "color"]
    },
    value: { // This will store the emoji for badge, or hex code for color
        type: String,
        require: true
    }
})

module.exports = mongoose.model('shopItems', shopItemSchema, 'shopItems')
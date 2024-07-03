const mongoose = require('mongoose');

let listSchema = mongoose.Schema({
    token: String,
}, {timestamps: true});

listSchema.index({createdAt: 1},{expiresIn: 300 + (3 * 3600)});

module.exports = mongoose.model("blacklist", listSchema);
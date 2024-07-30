const mongoose = require('mongoose');
//comitando
const listSchema = mongoose.Schema({
    token: String,
    expireDate: {
        type: Date
    },
}, { timestamps: true 

});

listSchema.index({ "expireDate": 1 }, { expireAfterSeconds: 10 });

module.exports = mongoose.model("blacklist", listSchema);

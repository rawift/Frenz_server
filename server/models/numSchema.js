const mongoose = require("mongoose")
const findOrCreate = require('mongoose-findorcreate');

const NumSchema = new mongoose.Schema({
    num:Number
})

NumSchema.plugin(findOrCreate);

const Num = mongoose.model("Num", NumSchema);

module.exports = Num

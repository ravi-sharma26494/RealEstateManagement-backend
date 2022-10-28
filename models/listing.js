const mongoose = require("mongoose")

const estateSchema = new mongoose.Schema({
    ppdid:String,
    image : String ,
    property : String, //
    contact : Number,
    area :   Number, //
    views : Number,
    daysleft : Number,
},{timestamps:true})

mongoose.model('Estate',estateSchema)
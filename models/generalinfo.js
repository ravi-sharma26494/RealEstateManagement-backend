const mongoose = require("mongoose")

const generalSchema = new mongoose.Schema({
    mobile : {type: String},
    image : {type: String},
    name : String,
    postedBy : String,
    saleType : String,
    featuredPackage:String,
    PPDPackage : String
})

const General = mongoose.model('General',generalSchema)

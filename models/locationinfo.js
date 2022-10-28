const mongoose = require("mongoose")

const LocationSchema = new mongoose.Schema({
    Email : {type: String,required : true},
    Area : {type: String,required : true},
    Address :{type: String,required : true},
    Ltittude : {type: String,required : true},
    City:{type: String,required : true},
    Pincode:{type: Number,required : true},
    Landmark :{type: String,required : true},
    Longittude: {type: String,required : true}
})

const Location = mongoose.model('Location',LocationSchema)
exports.model = Location;
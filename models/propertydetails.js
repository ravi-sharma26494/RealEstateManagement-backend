const mongoose = require("mongoose")

const propertiesSchema = new mongoose.Schema({
    length : Number,
    totalArea : {type: Number},
    noOfBHK :Number,
    attached : String,
    furnished:String,
    lift:String,
    propertyDescription :String,
    facing: String,
    breadth : String,
    areaUnit : Number,
    noOfFloor :Number,
    westernToilet : String,
    carParking:String,
    electricity:String,
    propertyDescription :String,
    facing:String
})

const Properties = mongoose.model('Properties',propertiesSchema)
// exports.model = Properties;
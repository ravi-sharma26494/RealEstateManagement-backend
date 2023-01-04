const express = require("express");
const cors = require("cors")
const app = express();
const mongoose = require("mongoose");

app.use(cors())
app.use(express.json());

require('./models/basicinfo')
require('./models/propertydetails')
require('./models/generalinfo')
require('./models/listing')
app.use(require('./routers/routes'))



const port = process.env.PORT || 8000
mongoose.connect("mongodb://localhost:27017/realestate")
.then(()=> {console.log("connection success")})
.catch((err)=> console.log(`Something went Wrong: ${err}`))

app.listen(port,()=> {console.log(`Server is up at ${port}`)})

//https://realestate-backend-project.herokuapp.com
// rishabh.ahuja@embifi.in
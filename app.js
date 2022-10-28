const mongoose = require("mongoose");
const express = require("express");
// const router = require("./routers/routes")
const cors = require("cors")
mongoose.connect("mongodb://localhost:27017/realestate")
.then(()=> {console.log("connection success")})
.catch((err)=> console.log(`Something went Wrong: ${err}`))

const app = express();
// app.use("/",router)
app.use(cors())
const port = process.env.PORT || 8000
require('./models/basicinfo')
require('./models/propertydetails')
require('./models/generalinfo')
require('./models/listing')

app.use(express.json());
app.use(require('./routers/routes'))
app.listen(port,()=> {console.log(`Server is up at ${port}`)})
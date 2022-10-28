const mongoose = require("mongoose");
const express = require("express");
const Basics = mongoose.model("Basics");
const Properties = mongoose.model("Properties");
const General = mongoose.model("General");
const Estate = mongoose.model("Estate");
const Login = require("../models/login");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const validator = require("express-validator");
const bodyparser = require("body-parser");
const cors = require("cors");
const { mapReduce } = require("../models/login");
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: false }));
route.use(cors());

const superConstant = new Map();
var superCount = 1100;
var newPPDID = '';

route.post("/api/posts", async (req, res) => {
  try {
    const posts = await Basics.create(req.body);
    res.json({
      status: "Success",
      posts: posts,
    });
    superConstant.set("property", posts.propertyType);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
  // console.log(req.body)
});

route.post("/api/basicinfo/posts", async (req, res) => {
  try {
    const posts = await Properties.create(req.body);
    res.json({
      status: "Success",
      posts: posts,
    });
    superConstant.set("area", posts.totalArea);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }

  // console.log(req.body)
});

route.post(
  "/api/basicinfo/propertydetails/generalinfo/posts",
  async (req, res) => {
    try {
      const postData = new General({
        image: req.body.image,
        mobile: req.body.mobile,
      });
      await postData.save();
      
      superConstant.set("image", "image");
      superConstant.set("contact", postData.mobile);

      //random Views and Days
      function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }

      await superConstant.set("views", randomNumber(0, 100));
      await superConstant.set("daysleft", randomNumber(0, 30));

      //Incremental ppdid
      let textInitial = "PPD";
      let resultPPDID = textInitial.concat(parseInt(superCount + 1));
      
      var recordsLength = 0;
      const details = await Estate.find().limit(1).sort({$natural:-1}) ;
      
      
          
      if (parseInt(details.length) < 1) {
        //console.log(recordsLength)
        console.log('I am here');
        const addPPDID = new Estate({
          ppdid: resultPPDID,
          image: superConstant.get("image"),
          property: superConstant.get("property"),
          contact: superConstant.get("contact"),
          area: superConstant.get("area"),
          views: superConstant.get("views"),
          daysleft: superConstant.get("daysleft"),
        }).save();
        superConstant.clear();
      } else if(parseInt(details.length) >= 1) {
        console.log('I am else if');
        const propertyDetail = await Estate.find().limit(1).sort({$natural:-1})
          .then((data) => {
            console.log(data)
            console.log(`DADAF: ${data.ppdid}`)
            var newPPDID = '';
            res.status(200).json({ data });
            console.log(`Stll string :${data.ppdid}`)
            const lastPPDID = JSON.stringify(data[0].ppdid);
            console.log(lastPPDID);
            
            const newNumber = parseInt(lastPPDID.split('PPD')[1]) + 1;
            newPPDID = "PPD".concat(newNumber);
            console.log(newPPDID)
            const addPPDID = new Estate({
              ppdid: newPPDID,
              image: superConstant.get("image"),
              property: superConstant.get("property"),
              contact: superConstant.get("contact"),
              area: superConstant.get("area"),
              views: superConstant.get("views"),
              daysleft: superConstant.get("daysleft"),
            }).save();
            superConstant.clear();
            //const addPPDID= new Estate({ppdid:newPPDID}).save();
          })
          .catch((err) => console.log(err));
         
      }
      //when there are no records

      res.json(postData);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
);

route.get("/images/:name", (req, res) => {
  const fileName = req.params.name;
  res.sendFile(__dirname + "/images/" + fileName);
  console.log(fileName);
  console.log(__dirname);
});

route.get("/listing", async (req, res) => {
  await Estate.find()
    .then((data) => {
      if(parseInt(data.length < 1)){
        res.status(200).json({message:'No data'})
      } else{
        res.status(200).json({ data });
      }
      
    })
    .catch((err) => console.log(err));
});

//find the data by PPDID
route.post("/searchppdid", async (req, res) => {
  const propertyDetail = await Estate.findOne({ superId: req.body.ppdId })
    .then((data) => {
      res.status(200).json({ data });
      console.log(data);
    })
    .catch((err) => console.log(err));
});
//Search/generate ppdid
// route.post('/api/generateppdid', async(req,res)=>{
//   const propertyDetail = await Estate.findOne()
//    .then((data)=>{
//        res.status(200).json({data})
//        const lastPPDID = data.ppdid;
//        const newNumber = (parseInt(lastPPDID.split('PPD')[1])+1);
//        const newPPDID = "PPD".concat(newNumber);
//         const addPPDID= new Estate({ppdid:newPPDID}).save();
//       }).catch((err)=> console.log(err))

// })

//------code for registration-------------------
route.post(
  "/signup",

  async (req, res) => {
    const { email, password, cpassword } = req.body;

    if (!email || !password || !cpassword) {
      res.status(422).json({ error: "fill all the details" });
    }

    try {
      const preuser = await Login.findOne({ email: email });

      if (preuser) {
        res.status(422).json({ message: "This Email, Already Exist" });
      } else if (password !== cpassword) {
        res
          .status(422)
          .json({ error: "Password and Confirm Password Not Match" });
      } else {
        const finalUser = new Login({
          email,
          password,
          cpassword,
        });

        // here password hasing

        const storeData = await finalUser.save();

        // console.log(storeData);
        res.status(201).json({ status: 201, storeData });
      }
    } catch (error) {
      res.status(422).json(error);
      console.log("catch block error");
    }
  }
);

// user Login

route.post("/login", async (req, res) => {
  // console.log(req.body)

  const { email, password } = req.body;

  const userValid = await Login.findOne({ email });
  if (userValid) {
    const isMatch = await bcrypt.compare(password, userValid.password);
    // console.log(userValid)

    if (!isMatch) {
      return res.status(422).json({ message: "invalid details" });
    } else {
      // token generate
      const token = await userValid.generateAuthtoken();

      // cookiegenerate
      res.cookie("usercookie", token, {
        expires: new Date(Date.now() + 9000000),
        httpOnly: true,
      });

      const result = {
        userValid,
        token,
      };
      res.status(201).json({ status: 201, result });
    }

    // res.json({ message: 'User does not exist ,Please Register' })
  } else {
    return res.json({ message: "User do not exist ,Please Signup" });
  }
});

//user valid
route.get("/validuser", authenticate, async (req, res) => {
  try {
    const ValidUserOne = await Login.findOne({ _id: req.userId });
    // console.log(ValidUserOne)
    return res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    return res.status(401).json({ status: 401, error });
  }
});
//logout
route.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("usercookie", { path: "/" });

    req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});
//
module.exports = route;
